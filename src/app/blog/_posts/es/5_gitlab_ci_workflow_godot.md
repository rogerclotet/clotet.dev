---
title: "Un flujo de GitLab CI para un juego de Android hecho con Godot"
description: "Cómo automatizo las publicaciones de mi juego de Godot con integración continua"
---

¿Hacía falta automatizar todo el proceso de compilación y publicación de mi juego [Drift Survivors](https://gitlab.com/drift-survivors/drift-survivors)? No. Soy el único desarrollador y podría compilarlo manualmente y subirlo a Google Play Console, como había hecho con otros juegos pequeños.

La cuestión es que, cuanto más automatizas, más fácil es desarrollar y volver al cabo de unos meses para añadir una funcionalidad o corregir un error. Si no, es probable que no recuerdes cómo se compilaba, qué almacén de claves o contraseña necesitas, o exactamente dónde subías las versiones en Google Play Console. Automatizar estos pasos me permite dedicar ese tiempo al juego.

### Visión general

Mi flujo actual de [integración continua](https://en.wikipedia.org/wiki/Continuous_integration) es más o menos este:

![Flujo de integración continua por etapas](/blog/5_1_stages.png)

O, si lo miramos por dependencias:

![Flujo de integración continua por dependencias](/blog/5_2_needs.png)

Repasaré la configuración de cada etapa. Por ahora, cada tarea solo se ejecuta cuando se crea una etiqueta (`only: - tags`), que es cuando quiero publicar una versión nueva. Esto me permite subir commits a la rama `main` cuando quiera. Como normalmente soy el único desarrollador del proyecto, tiene sentido no crear ramas nuevas para la mayoría de los cambios pequeños.

### Etapa de compilación

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

- `.godot-android` es la configuración compartida de las dos tareas de esta etapa. Define la imagen utilizada, una bifurcación de https://github.com/aBARICHELLO/godot-ci/ para poder usar Godot 4 hasta que se integren las correcciones, los directorios de caché de los recursos importados y algunos pasos de configuración del editor de Godot y del proyecto para preparar la compilación. También ejecuta el editor de Godot sin interfaz gráfica y lo cierra inmediatamente para asegurarse de que los recursos se importan y el proyecto se inicializa correctamente.
- `android_aab` amplía esta configuración, compila la configuración de exportación AAB, comprueba que el archivo se ha generado correctamente y lo marca como artefacto para exportar. El archivo AAB es el que necesitamos para subir el juego a la Play Store.
- `android_apk` es igual que `android_aab`, pero crea un archivo APK que se puede instalar directamente en un dispositivo Android. Usé dos tareas separadas para exportar los dos archivos por separado y facilitar su descarga, como veremos a continuación.

### Etapa de publicación

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

- `publish_packages` publica los dos archivos exportados, AAB y APK, como [paquetes genéricos](https://docs.gitlab.com/ee/user/packages/generic_packages/) en GitLab. Esto nos permite tener un enlace permanente a los archivos de la versión, ya que [no se recomienda enlazar los artefactos de compilación](https://docs.gitlab.com/ee/user/project/releases/release_fields.html#use-a-generic-package-for-attaching-binaries).
- `release` crea la versión en GitLab, recopila automáticamente las descripciones de los cambios de los commits desde la última versión y enlaza los paquetes de la tarea anterior.
- `.fastlane` es una configuración de tarea compartida que usan `deploy_to_internal` y `promote_to_production`, que veremos más adelante. Utiliza una imagen que incluye [fastlane](https://docs.fastlane.tools/), una herramienta para automatizar publicaciones y cambios de aplicaciones en la Play Store y la App Store. También descarga los archivos seguros necesarios de GitLab, en concreto el almacén de claves para firmar la aplicación que queremos desplegar.
- `deploy_to_internal` usa fastlane para subir el paquete AAB al canal `internal` de la Play Store, que sirve para hacer pruebas internas con un grupo limitado de usuarios autorizados. Después de actualizar el juego en el móvil y comprobar que funciona, puedo pasar a la última etapa.

### Etapa de producción

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

- `promote_to_production` promueve la versión que hemos probado en el canal `internal` al canal `production1`, que Google revisará antes de ponerla a disposición de todos los usuarios. Este paso debe activarse manualmente, por si la versión interna no era adecuada para producción.

Podríamos añadir pasos intermedios, como pasar antes por los canales `alpha` o `beta` para permitir que algunos usuarios prueben la actualización antes de llegar a producción, pero por ahora tengo suficiente.

### Conclusión

Configurarlo requirió muchas pruebas y errores, pero me ahorra trabajo con cada publicación. También genera versiones bien presentadas en el repositorio, donde los usuarios pueden descargar los paquetes exportados aunque no usen la Play Store o quieran probar una versión antigua del juego. Las versiones tienen este aspecto:

![Ejemplo de publicación](/blog/5_3_release.png)

Creé esta configuración para mi juego [Drift Survivors](https://gitlab.com/drift-survivors/drift-survivors), que ya puedes conseguir gratis [en la Play Store](https://play.google.com/store/apps/details?id=dev.clotet.driftsurvivors). Puedes ver una versión actualizada de la configuración [aquí](https://gitlab.com/drift-survivors/drift-survivors/-/blob/main/.gitlab-ci.yml).
