---
title: "Un flux de GitLab CI per a un joc d'Android fet amb Godot"
description: "Com automatitzo les publicacions del meu joc de Godot amb integració contínua"
---

Calia automatitzar tot el procés de compilació i publicació del meu joc [Drift Survivors](https://gitlab.com/drift-survivors/drift-survivors)? No. Soc l'únic desenvolupador i podria compilar-lo manualment i pujar-lo a Google Play Console, com havia fet amb altres jocs petits.

La qüestió és que, com més automatitzes, més fàcil és desenvolupar i tornar-hi al cap d'uns mesos per afegir una funcionalitat o corregir un error. Si no, és probable que no recordis com es compilava, quin magatzem de claus o contrasenya necessites, o exactament on pujaves les versions a Google Play Console. Automatitzar aquests passos em permet dedicar aquest temps al joc.

### Visió general

El meu flux actual d'[integració contínua](https://en.wikipedia.org/wiki/Continuous_integration) és més o menys aquest:

![Flux d'integració contínua per etapes](/blog/5_1_stages.png)

O, si el mirem per dependències:

![Flux d'integració contínua per dependències](/blog/5_2_needs.png)

Repassaré la configuració de cada etapa. De moment, cada tasca només s'executa quan es crea una etiqueta (`only: - tags`), que és quan vull publicar una versió nova. Això em permet pujar commits a la branca `main` quan vulgui. Com que normalment soc l'únic desenvolupador del projecte, té sentit no crear branques noves per a la majoria de canvis petits.

### Etapa de compilació

```yaml
.godot-android:
  image: rogerclotet/godot-ci:4.0.2
  cache:
    key: import-assets
    paths:
      - .godot/imported/
  before_script:
    - echo $SECRET_RELEASE_KEYSTORE_BASE64 | base64 --decode > /root/release.keystore
    - echo "textures/vram_compression/import_etc2_astc=true" >> project.godot
    - echo "Opening editor to import assets..."
    - godot -v -e --quit --headless 2>&1 | grep -v "StringName"
    - sed 's@keystore/release=".*"@keystore/release="'/root/release.keystore'"@g' -i export_presets.cfg
    - sed 's@keystore/release_user=".*"@keystore/release_user="'$SECRET_RELEASE_KEYSTORE_USER'"@g' -i export_presets.cfg
    - sed 's@keystore/release_password=".*"@keystore/release_password="'$SECRET_RELEASE_KEYSTORE_PASSWORD'"@g' -i export_presets.cfg
    - sed 's@version/code=.*@version/code='$(git show -s --format=%ct $CI_COMMIT_TAG)'@g' -i export_presets.cfg
    - sed 's@version/name=".*"@version/name="'$CI_COMMIT_TAG'"@g' -i export_presets.cfg

android_aab:
  stage: build
  extends: .godot-android
  script:
    - godot -q --headless --export-release "Android AAB" $AAB_FILE 2>&1 | grep -v "StringName"
    - if ! [[ -f "$AAB_FILE" ]]; then exit 1; fi
  only:
    - tags
  artifacts:
    paths:
      - $AAB_FILE

android_apk:
  stage: build
  extends: .godot-android
  script:
    - godot -q --headless --export-release "Android APK" $APK_FILE 2>&1 | grep -v "StringName"
    - if ! [[ -f "$APK_FILE" ]]; then exit 1; fi
  only:
    - tags
  artifacts:
    paths:
      - $APK_FILE
```

- `.godot-android` és la configuració compartida de les dues tasques d'aquesta etapa. Defineix la imatge utilitzada, una bifurcació de https://github.com/aBARICHELLO/godot-ci/ per poder fer servir Godot 4 fins que s'integrin les correccions, els directoris de memòria cau dels recursos importats i alguns passos de configuració de l'editor de Godot i del projecte per preparar la compilació. També executa l'editor de Godot sense interfície gràfica i el tanca immediatament per assegurar-se que els recursos s'importen i el projecte s'inicialitza correctament.
- `android_aab` amplia aquesta configuració, compila la configuració d'exportació AAB, comprova que el fitxer s'ha generat correctament i el marca com a artefacte per exportar. El fitxer AAB és el que necessitem per pujar el joc a la Play Store.
- `android_apk` és igual que `android_aab`, però crea un fitxer APK que es pot instal·lar directament en un dispositiu Android. Vaig fer servir dues tasques separades per exportar els dos fitxers per separat i facilitar-ne la descàrrega, com veurem a continuació.

### Etapa de publicació

```yaml
publish_packages:
  stage: publish
  needs: [android_aab, android_apk]
  image: curlimages/curl:latest
  script:
    - 'curl --header "JOB-TOKEN: $CI_JOB_TOKEN" --upload-file $AAB_FILE "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/generic/drift-survivors/${CI_COMMIT_TAG}/${AAB_FILE}"'
    - 'curl --header "JOB-TOKEN: $CI_JOB_TOKEN" --upload-file $APK_FILE "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/generic/drift-survivors/${CI_COMMIT_TAG}/${APK_FILE}"'
  only:
    - tags

release:
  stage: publish
  needs: [publish_packages]
  image: registry.gitlab.com/gitlab-org/release-cli:latest
  only:
    - tags
  before_script:
    - apk add git
  script:
    - echo "Creating release $CI_COMMIT_TAG..."
  release:
    tag_name: $CI_COMMIT_TAG
    description: |
      Changes:
      $(git log $(git describe --abbrev=0 --tags --exclude=$CI_COMMIT_TAG)..$CI_COMMIT_TAG --oneline --no-decorate --reverse | sed "s/^[^ ]* /- /g")
    assets:
      links:
        - name: AAB
          url: ${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/generic/drift-survivors/${CI_COMMIT_TAG}/${AAB_FILE}
          link_type: package
        - name: APK
          url: ${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/generic/drift-survivors/${CI_COMMIT_TAG}/${APK_FILE}
          link_type: package

.fastlane:
  image: cijumbo/fastlane
  before_script:
    - bundle update fastlane
    - curl -s https://gitlab.com/gitlab-org/incubation-engineering/mobile-devops/download-secure-files/-/raw/main/installer | bash
  dependencies:
    - android_aab

deploy_to_internal:
  stage: publish
  needs: [android_aab]
  extends: .fastlane
  script: bundle exec fastlane supply --track internal --aab $EXPORT_NAME.$CI_COMMIT_TAG.aab
  only:
    - tags
```

- `publish_packages` publica els dos fitxers exportats, AAB i APK, com a [paquets genèrics](https://docs.gitlab.com/ee/user/packages/generic_packages/) a GitLab. Això ens permet tenir un enllaç permanent als fitxers de la versió, ja que [no es recomana enllaçar els artefactes de compilació](https://docs.gitlab.com/ee/user/project/releases/release_fields.html#use-a-generic-package-for-attaching-binaries).
- `release` crea la versió a GitLab, recull automàticament les descripcions dels canvis dels commits des de l'última versió i enllaça els paquets de la tasca anterior.
- `.fastlane` és una configuració de tasca compartida que fan servir `deploy_to_internal` i `promote_to_production`, que veurem més endavant. Utilitza una imatge que inclou [fastlane](https://docs.fastlane.tools/), una eina per automatitzar publicacions i canvis d'aplicacions a la Play Store i l'App Store. També descarrega els fitxers segurs necessaris de GitLab, concretament el magatzem de claus per signar l'aplicació que volem desplegar.
- `deploy_to_internal` fa servir fastlane per pujar el paquet AAB al canal `internal` de la Play Store, que serveix per fer proves internes amb un grup limitat d'usuaris autoritzats. Després d'actualitzar el joc al mòbil i comprovar que funciona, puc passar a l'última etapa.

### Etapa de producció

```yaml
promote_to_production:
  stage: production
  needs: [deploy_to_internal]
  extends: .fastlane
  when: manual
  script: bundle exec fastlane supply --track internal --track_promote_to production --version_code $(git show -s --format=%ct $CI_COMMIT_TAG)
  dependencies: []
  only:
    - tags
```

- `promote_to_production` promou la versió que hem provat al canal `internal` al canal `production1`, que Google revisarà abans de posar-la a disposició de tots els usuaris. Aquest pas s'ha d'activar manualment, per si la versió interna no era adequada per a producció.

Podríem afegir passos intermedis, com passar abans pels canals `alpha` o `beta` per permetre que alguns usuaris provin l'actualització abans d'arribar a producció, però de moment ja en tinc prou.

### Conclusió

Configurar-ho va requerir moltes proves i errors, però m'estalvia feina amb cada publicació. També genera versions ben presentades al repositori, on els usuaris poden descarregar els paquets exportats encara que no facin servir la Play Store o vulguin provar una versió antiga del joc. Les versions tenen aquest aspecte:

![Exemple de publicació](/blog/5_3_release.png)

Vaig crear aquesta configuració per al meu joc [Drift Survivors](https://gitlab.com/drift-survivors/drift-survivors), que ja pots aconseguir gratis [a la Play Store](https://play.google.com/store/apps/details?id=dev.clotet.driftsurvivors). Pots veure una versió actualitzada de la configuració [aquí](https://gitlab.com/drift-survivors/drift-survivors/-/blob/main/.gitlab-ci.yml).
