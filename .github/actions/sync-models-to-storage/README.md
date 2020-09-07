# Sync models to storage action

Uses [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) to sync models to an Azure storage account

## Usage

### Example

Place in a `.yml` file such as this one in your `.github/workflows` folder. [Refer to the documentation on workflow YAML syntax here.](https://help.github.com/en/articles/workflow-syntax-for-github-actions)

```yaml
name: Sync Models to Storage
on:
  push:
    branches:
      - master
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ./.github/actions/sync-models-to-storage
        with:
          account_name: azstorageaccount
          account_key: ${{ secrets.storageKeyOne }}
          container_name: '$web'
          exclude_path: '.github'
          exclude_pattern: '*.md;*.ps1'
```

### Required Variables

| Key                 | Value                                                                      |
|---------------------|----------------------------------------------------------------------------|
| `account_name` |Name of the Azure storage account to use|
| `account_key`  |Account key for access to the Azure storage account|
| `container_name` |The destination container name to|

### Optional Variables

| Key                 | Value                                                                      |
|---------------------|----------------------------------------------------------------------------|
| `source_dir` |The source file path to sync from. Defaults to '.'|
| `exclude_path`  |Paths to exclude from the sync. For example '.github'|
| `exclude_pattern` |File patterns to exclude from the sync. For example '\*.md;\*.ps1'|
