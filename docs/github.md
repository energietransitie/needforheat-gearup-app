# GitHub documentation
This file aims to explain the workflows and pullrequest template that are used as part of GitHub in [the .github/ folder](https://github.com/energietransitie/needforheat-gearup-app/tree/main/.github).

## Pull Request Template
The template can be read in the [PULL_REQUEST_TEMPLATE.md](https://github.com/energietransitie/needforheat-gearup-app/blob/main/.github/PULL_REQUEST_TEMPLATE.md?plain=1).

This template should be filled in for every pullrequest to ensure that reviewers know what the pullrequest is about.

## Workflows
The project has multiple workflows that are all used to ensure the quality of the app. In addition, the workflow helps with the process of building the apps and making them ready for release to production or test.

Please ensure that you set the secrets for the API URL and the Google Maps API Key in [GitHub Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).

These workflows use [GitHub Actions](https://docs.github.com/en/actions) to run.

### [For every pullrequest]
These workflows run for every pullrequest that gets made.

---

#### eslint.yml
Uses [ESLint](https://eslint.org/) to check for problems in code.

---

#### merge-conflict-finder.yml
Checks for conflicts in code.

---

#### merge-to-default-warning.yml
When attempting to merge to main, it will create a message to warn you are doing this.

---

#### typescript.yml
Checks for TypeScript issues in code.

---

### [Push to main]
These workflows are run when a pullrequest gets pushed and thus merged into the main branch.

Note that `semantic-release.yml` gets ran first before `eas-build.yml`.

---
#### semantic-release.yml
Creates a new semantic release on GitHub with an automatic generated `CHANGELOG.MD` with the new changes based on the commits.

##### eas-build.yml
After a semantic release, this workflows uses EAS to create binaries and so they can be pushed to the stores. 

Also see [Deploying](./deploying.md) for more info.

---