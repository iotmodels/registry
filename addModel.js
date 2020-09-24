import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import { dtmi2path, getDependencies, checkIds } from './repo-convention.js'
// import { expand } from './expand-dependencies-fs.js'

// import { execSync } from 'child_process'
// const parseWithDotNet = file => {
//   execSync(`dtdl2-validator /f=${file} /resolver=local`, { stdio: 'inherit' })
// }

/**
 * @description Adds a model to the repo. Validates ids, dependencies and set the right folder/file name
 * @param {string} file
 */
const addModel = async (file) => {
  if (!fs.existsSync(file)) {
    console.error('file not found:' + file)
    process.exit()
  }
  // await parseWithDotNet(file)

  const rootJson = JSON.parse(fs.readFileSync(file, 'utf-8'))

  if (rootJson['@context'] && rootJson['@context'] === 'dtmi:dtdl:context;2') {
    checkIds(rootJson)
    const id = rootJson['@id']
    const deps = getDependencies(rootJson)
    deps.forEach(d => {
      const fileName = dtmi2path(d)
      if (fs.existsSync(fileName)) {
        console.log(`Dependency ${d} found in the index`)
        const model = JSON.parse(fs.readFileSync( fileName, 'utf-8'))
        if (model['@id'] !== d) {
          console.log(`ERROR: LowerCase issue with dependent id ${d}. Was ${model['@id']}. Aborting`)
          process.exit()
        }
      } else {
        console.error(`ERROR: Dependency ${d} NOT found. Aborting`)
        process.exit()
      }
    })

    const fileName = dtmi2path(id)
    if (fs.existsSync( fileName)) {
      console.log(`ERROR: ID ${id} already exists at ${fileName} . Aborting `)
      process.exit()
    }
    const modelFolder = path.dirname(fileName)
    mkdirp(modelFolder).then(async m => {
      console.log(`folder created ${modelFolder}`)
      fs.copyFileSync(file, fileName)
      console.log(`Model ${id} added successfully to ${fileName}`)

      // const deps = await expand(id)
      // const depsFile = path.join(modelFolder, fileName.replace('.json', '.deps.json'))
      // if (fs.existsSync(depsFile)) fs.unlinkSync(depsFile)
      // fs.writeFileSync(depsFile, JSON.stringify(deps, null, 2))
      // console.log(`Model Deps of ${id} added successfully to ${depsFile}`)
    })
  } else {
    console.error(`File ${file} is not a valid DTDL 2 interface`)
  }
}

const main = async () => {
  const file = process.argv[2]
  console.log(`processing: ${file}`)
  await addModel(file)
}
main()
