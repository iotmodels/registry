# IoT Models Registry

This repository contains [DTDL](https://aka.ms/dtdl) model definitions.

All models, and their dependencies are listed in the `[model-index.json](model-index.json)` file.

The models, and the index are available in:

## [https://iotmodels.github.io/registry](https://iotmodels.github.io/registry)

## Submitting new models

This repo accepts new model submission following the next rules.

- Valid DTDL files.
- Dependencies can be resolved using the convention
- The files are stored following the `dtmi` folder hierarchy

There are automatic checks in place per each PR.

### Adding a new interface

The script `addModel.js` (requires node) can be used to add the required interface to the repo.

### Validation

The repo provides some tools and scripts to validate your models.

`dtdl2-validator`

## Resolving models

```javascript
const { modelFolder, fileName } = dtmi2path(dtmi)
const url = `${modelFolder}/${fileName.replace('.json', '.deps.json')}`
const docs = await (await window.fetch(url)).json()
```
