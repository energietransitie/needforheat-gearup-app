# Contribution Guidelines
## Prerequisites
Make sure you have read the [Developing - Getting Started](./docs/developing.md) guide.

## Creating an issue
If you have found a bug, room for improvement, missing documentation or have a question you can create an issue on [GitHub](https://github.com/Need-for-Heat/need-for-heat/issues). \
Make sure to write as much details as possible in the description of your issue. That way, other contributors will be more easily able to understand and help.

## Changing or adding code
Make sure you have read the [Project Structure](./project-structure.md) so you understand what goes where. To ensure code quality there are some conventions your code has to meet:
- Code styling must match the requirements in the [.editorconfig](../.editorconfig)
- Code follows the SOLID-principles as much as possible
- No commented out code
- Use the return early pattern if possible (to prevent nesting)
- Code does not contain magic values

### Conventional commits (and branches)
Now that you have written your code and you're sure everything is ready to go; you're ready to commit the changes. To keep source control clean and to automatically generate changelogs, this repository uses conventional commit messages.\
These are based on <https://www.conventionalcommits.org/en/v1.0.0>.

A commit message follows this format:
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```
And a branch follows this format:
```
<type>[optional scope]/<short-description>
```
Where the `<type>` is one of the following values:

| **Type** | **When to use** |
| -------- | --------------- |
| build | Changes that affect the build system or external dependencies |
| ci | Changes to CI configuration files and scripts |
| docs | Documentation only changes |
| feat | A new feature |
| fix | A bug fix |
| perf | A code change that improves performance |
| refactor | A code change that neither fixes a bug nor adds a feature |
| chore | Changes to tasks or applying pull request feedback that fit no other type |
| revert | Reverting older commits |
| style | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| test | Adding missing tests or correcting existing tests |

**An example:** you're making a login page. Preferably your branch name would be: `feat/login-page` (or something similar). A possible commit messages would be: `feat: add login page`.

## Creating a pull request

When creating a pull request make sure you make use of the default pull request template.

## Changing or adding a translation or language

For information about changing or adding translations or a new language, check out [Translating - Getting Started](./translating.md).
