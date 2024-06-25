# Deploying the app
NeedForHeat GearUp is published to the Apple App Store and Google Play Store App Store on the Windesheim account.

For access to either of those developer accounts, please contact [@henriterhofte](https://github.com/henriterhofte).

## Table of contents
- [1. General Information](#1-general-information)
- [2. Manual for deploying first time](#2-manual-for-deploying-first-time)
    - [2.1. Prepare entries](#21-prepare-entries)
    - [2.2. Prepare Firebase](#22--prepare-firebase)
    - [2.3. Prepare Expo & GitHub](#23-prepare-expo--github)
    - [2.4. App Review](#24-app-review)
    - [2.5. Finish Expo Setup with certificates](#25-finish-expo-setup-with-certificates)
- [3. Deploying to App Stores after first time](#3-deploying-to-app-stores-after-first-time)
    - [3.1. Apple App Store](#31-apple-app-store)
    - [3.2. Google Play Store](#32-google-play-store)


## 1. General information
Using GitHub Actions, the app is automatically built when merging a new version to the `main` branch. This is done using the `expo build` command, which you don't have to run yourself. The build is then uploaded to the `@nfh` organization on Expo under the `needforheat-gearup` project.

For more information on the workflows, check out the [GitHub documentation of the project](./github.md).

> **Note** \
> App signing should be handled by Expo, so you don't have to worry about that. \
> Doing it manually is possible but not recommended. There is information in this documentation about that but we really do recommend just using Expo and EAS.

## 2. Manual for deploying first time
Deploying is no mean feat. Having to rely on certificates, Firebase and Apple and Google to properly deploy this to public can take a bit tinkering. Especially for new developers. That's why this manual will help go through everything to ensure that **you** will know how to do it as well.

Note that Google and Apple provide more extensive documentation for doing this. You should check them out too when you are doing this as limitations and rules change over time.

### 2.1. Prepare entries
First thing is obvious. Pay for Google and/or Apple to be able to put an App on their stores. This second task is easy and all you need to do is make new entries.

You can setup both store pages up to its entirety. Make sure to provide as much information as you can to help reviewers.

After this, we can continue preparing the rest of the app.

### 2.2. Prepare Firebase
> **Important notice** \
> [Dynamic Links are Deprecated](https://firebase.google.com/docs/dynamic-links) on August 25, 2025. \
> New Firebase projects can not create new dynamic links. You need to use an existing project to support this like the `warmtewatcher` project \
> In the future, dynamic links will be replaced. But right now they are still here.

In Firebase, add both the Android and iOS app to the project with the right information. Later after they have app store entries, you can put in a bit more information like store IDs.

After that create a simple dynamic link that can redirect to the App Store entries or open in a new browser. The app uses this feature in a simple way and all Firebase needs to do is to make sure the app can open through the link and the rest gets handled on its own.

### 2.3. Prepare Expo & GitHub
After that you can create a new Expo organisation and/or a project. Essentially there is not much you need to do here apart from updating the [workflow](./github.md#push-to-main) to make sure it points to the right project.

In addition. Setup the environment variables in GitHub Secrets as shown in the workflow. Don't forget to create an [Expo Access Token](https://docs.expo.dev/accounts/programmatic-access/) and a GitHub SSH Key. Then you can set up the following variables:
- `EXPO_TOKEN`
- `GH_SSH_KEY` (Also in Expo Secrets!)
- `NFH_API_URL`
- `GOOGLE_MAPS_API_KEY`
- `NFH_MANUAL_URL`

> **Note `EXPO_TOKEN`** \
> `EXPO_TOKEN` is only important for the workflow.

> **Note `GOOGLE_MAPS_API_KEY`** \
> Make sure the Google Maps API Key is setup to allow the app identifier.

#### Note about `GH_SSH_KEY` in Expo Secrets
This requires a bit more setting up to do. You need to generate a new key and add it to a GitHub account: \
See [GitHub docs for creating one](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/) and [adding it to your account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

To set it up for Expo so it can use with [eas-build-pre-install.sh](../apps/expo/scripts/eas-build-pre-install.sh). \
You need to do the `Copy the SSH public key to your clipboard.` step again of adding the key to your account. But omit the `.pub`:

```bash
clip < ~/.ssh/id_ed25519
```

Then [encode it in Base64](https://www.base64encode.org/) before adding it as a secret in Expo Secrets on the project page

---

Now we're ready to setup the project with Expo:
#### 2.3.1. Setting up Expo in the project.
This is straight forward, but crucial to make it easier to create binaries with the right certificates and all. Full documentation is [here](https://docs.expo.dev/eas-update/getting-started/).

Make sure you have `eas-cli` installed: 
```bash
npm install --global eas-cli
```

Now login to Expo with `eas login`. Afterwards `cd` into `./apps/expo` and run `eas build:configure`. \
Update Expo config if you need to so it points to your project. Same goes for the workflow.

Expo should now be setup and we can create binaries later on.

### 2.4. App Review
Now comes the hard part. We need to prepare the app to be sent over for review to Google and Apple. It is crucial that Firebase is working and you can get into the app with an invitation link.

#### 2.4.1. Prepare accounts
Step one is simple. Create a campaign and accounts for Google and Apple so the reviewer can log in.

You should have provided as much information as possible already in the app entries, occasionally they won't even bother logging into the app.

> **Note Apple** \
> Make sure you fill in your `plist`'s as much as possible. \
> In addition, make screenshots using the simulator.

#### 2.4.2. Prepare binaries
Now the second step is preparing the binaries for Google and Apple to review for. Google asks for `.aab` and Apple for an `.ipa`. These binaries need to be signed with the proper upload certificate.

For Google, signing can be handled by Google themselves. See [Expo First Android Submission](https://github.com/expo/fyi/blob/main/first-android-submission.md)

For Apple, finding the right documentation is hard but no worries, we can do it through Expo as well: [Submit iOS](https://docs.expo.dev/submit/ios/). \
You should also be able to export and upload it with xCode, which also can create the keys for you.

---
***Important Notice Regarding `eas-build-pre-install.sh`*** \
This file **NEEDS** `LF`-line endings and not `CRLF`. Git will usually automatic convert it to `CRLF`.

In Visual Studio Code you can change it in the bottom right corner.

You may need to disable Git's auto-CRLF with:
```bash
git config --global core.autocrlf false
```

---

Now for creating the binaires we use Expo. To make sure everything runs well, we manually start the build for Android and iOS each with:
```bash
yarn workspace app eas:android:build
```
and
```bash
yarn workspace app eas:ios:build
```
Running these commands for the first time on a new project will make you go through a setup. Just let it do it thing and it will be smooth sailing. \
If it mentions an existing project, make sure its the right one before proceeding.

For iOS, make sure you use the `NeedforHeat Release` scheme as the other one is the `Expo Go` version. \
_Though, it technically doesn't matter as Expo will build as `production`_

Now the binaries should be getting built on the [EAS NFH GearUp Project build page](https://expo.dev/accounts/nfh/projects/needforheat-gearup/builds). You can download these to send over.

#### 2.4.3. Review!
Upload the binaries to their stores and put in the right notes so the reviewers know how to review it!
It might take a bit and you might need to do some additional changes. But after that, you should have less issue with reviewers.

See [3. Deploying to App Stores](#3-deploying-to-app-stores) on how to do this.

## 3. Deploying to App Stores
After setting up everything, the workflow after pushing to main takes care most of the work now. \
You can also manually start this workflow through GitHub Actions.

> **Note workflow** \
> If it gives an error related to backslashes: \
> Check the iOS `project.pbxproject` file for them, remove them and add `"` around the script so it will still be able to run with spaces.

Here is an explanation of how to deploy after doing it the first time for each store:

### 3.1. Apple App Store
This build will be submitted to the App Store after the workflow finishes **IF** an App Store Connect API Key is available. This can take a while, sometimes over 1 hour.

When this is done, you can check the status of the submission in the [App Store Connect dashboard](https://appstoreconnect.apple.com/apps/6503364746/testflight/ios). This is where you can release the build to TestFlight users and/or App Store users.

#### 3.1.1. Manual deploying
The App Store is updated using the Expo CLI. This is done using the following command (execute in the `apps/expo` directory & requires `expo-cli` to be installed):

```bash
eas submit -p ios --profile production
```

This will ask you to log in to the Expo account. After logging in, select the option `Select a build from EAS` and select the most recent EAS build. 

You can either generate a new App Store Connect API Key.Expo handles the API Key creation for you if it can. Otherwise, follow the below instructions for using App Password.

##### Using Apple ID App Password
You can generate an App Password in your [Apple ID settings](https://appleid.apple.com/account/manage). \
We'll partly follow [Expo documentation](https://docs.expo.dev/submit/ios/#do-you-want-to-use-your-own).

###### Step 1: Add the Apple ID
Inside the eas.json file under `submit`, add your Apple ID under the "appleId" field. It should look something like this:
```json
{
    "submit": {
        "production": {
            "ios": {
            "appleId": "s1234567@student.windesheim.nl",
            }
        }
    }
}
```
>**Important notice when using App Password** \
> MAKE SURE TO CLEAR THIS FIELD `EAS.JSON` AFTER USING IT. \
> You (usually) do not want to expose your Apple ID when commiting!

---

###### Step 2: Add the Apple App Specific Password
Set the `EXPO_APPLE_APP_SPECIFIC_PASSWORD` environment variable. The method varies depending on your operating system:
- Windows: Open Command Prompt (and NOT PowerShell) and use the set command:
```bash
set EXPO_APPLE_APP_SPECIFIC_PASSWORD=your_app_specific_password
```

- Mac/Linux: Open Terminal and use the export command:
```bash
export EXPO_APPLE_APP_SPECIFIC_PASSWORD=your_app_specific_password
```

--- 

You now have set yourself up to use App Password, run the submit command again.

### 3.2. Google Play Store
The Play Store is updated using the Google Play Console, but not uploaded automatically to it. This is done using the following steps:

1. Download the `.aab` file that was generated by the worklow: [EAS NFH GearUp Project](https://expo.dev/accounts/nfh/projects/needforheat-gearup/builds).
2. Go to the [Google Play Console](https://play.google.com/console/u/2/developers/5055222802254203943/app/4976394412478460038/tracks/production?tab=releases) and upload the `.aab` file you've just downloaded.
3. Fill in the release version name & notes (for each language) and click `Save`.
4. Click `Review` and then `Start rollout to production`.

### 4. Semantics
If you want to update to a major version (3.0.0, for instance). What (according to ChatGPT) should be done is only create a new tag in GitHub before pushing and it should use it instead.