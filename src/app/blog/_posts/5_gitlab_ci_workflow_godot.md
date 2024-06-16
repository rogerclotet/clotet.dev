---
title: A GitLab CI workflow for an Android game made with Godot
description: How I automate my Godot game releases using continuous integration
slug: gitlab-ci-workflow-android-game-godot
tags: ["ci", "gitlab", "android", "godot"]
date: 2023-05-07
---

Did I need to automate everything related to building and releasing my game [Drift Survivors](https://gitlab.com/drift-survivors/drift-survivors)? Of course not. I'm the only developer and I could simply do builds manually and upload them to the Google Play Console as I did with other small games I created.

The thing is, the more you automate, the easier it is to develop and, more importantly, to come back after a few months to add a new feature or fix some bug. Otherwise, it's likely you don't remember how the build worked, what keystore or password you need, or where exactly in the Google Play Console you uploaded versions. To me, not needing to remember a thing is saving effort you can be spending doing something more productive.

### Overview

My current [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) pipeline is something like this:

![Continuous integration worflow by stage](/blog/5_1_stages.png)

Or if we look at it by dependencies:

![Continuous integration workflow by dependencies](/blog/5_2_needs.png)

I'll explain and copy the configuration for each state. For now, every job is only run when a tag is created (`only: - tags`), since it's when I want to create a new release, enabling me to just push commits to the `main` branch when I want. Since I'm usually the only developer in the project, it makes sense to skip creating new branches for most small changes.

### Build stage

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

- `.godot-android` is the shared configuration for the 2 jobs in this stage. It defines the image used (a fork of https://github.com/aBARICHELLO/godot-ci/ to be able to use Godot 4 until the new fixes are merged), the cache directories for imported assets, and some configuration steps for both the Godot editor and the project settings, to prepare for the build itself. It also runs the Godot editor in headless mode and quitting right after that, just to make sure assets are imported and the project is properly initialized.
- `android_aab` extends this, builds the AAB export configuration and makes sure the file has been generated correctly, and marks it as an artifact to be exported. An AAB file is what we need to upload the game to the Play Store.
- `android_apk` is exactly like `android_aab` but it creates an APK file, which can be installed directly to any Android device. I used two separate jobs for this to export the two files separately, to make it easier to make them downloadable, as we'll see below.

### Publish Stage

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

- `publish_packages` publishes the two exported files (AAB and APK) as [generic packages](https://docs.gitlab.com/ee/user/packages/generic_packages/) to GitLab. This allows us to have a permanent link to the files in the release, since [linking to build artifacts is not recommended](https://docs.gitlab.com/ee/user/project/releases/release_fields.html#use-a-generic-package-for-attaching-binaries).
- `release` creates the GitLab release, automatically gathering changes descriptions from the commits since the last release, and linking the packages from the previous job.
- `.fastlane` is a shared job configuration used by `deploy_to_internal` and `promote_to_production`, which we'll see later. It uses an image that includes [fastlane](https://docs.fastlane.tools/), a tool to automate releases and changes to apps in the Play Store and the App Store. It also downloads the needed secure files from GitLab, namely the keystore to sign the app we want to deploy.
- `deploy_to_internal` uses fastlane to upload the AAB package to the `internal` track in the Play Store, used for internal testing with limited approved users. After I test everything looks okay when I update the game on my phone, we can go to the final stage:

### Production stage

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

- `promote_to_production` promotes the version we tested in the `internal` track to the `production1` track, which will be reviewed by Google and made available to all users after that. This step must be triggered manually, in case the internal version was not suitable for production.

We could add some intermediate steps, like going th the `alpha` or `beta` tracks before that, to allow some users to start testing the new update before going to production, but for now that's more than enough.

### Conclusion

Automating your releases isn't free, it took a lot of trial and error, but I think it has many benefits. It also generates some nice releases in the repository, where your users can download the exported packages even if they don't use the Play Store, or just want to test an old version of the game. The releases look like this:

![Release example](/blog/5_3_release.png)

This set up was created for my game [Drift Survivors](https://gitlab.com/drift-survivors/drift-survivors), which you can already get for free [in the Play Store](https://play.google.com/store/apps/details?id=dev.clotet.driftsurvivors), and you can see a more updated version of the configuration [here](https://gitlab.com/drift-survivors/drift-survivors/-/blob/main/.gitlab-ci.yml).
