import fs from 'fs'
import glob from 'glob'
import { expand } from './expand-dependencies-fs.js'

const main = () => {
  // glob('dtmi/**/*.deps.json', (err, files) => {
  //   if (err) throw err
  //   files.forEach(f => fs.unlinkSync(f))
  // })

  glob('dtmi/**/*.json', (err, files) => {
    if (err) throw err
    files.forEach(async f => {
      console.log('processing ' + f)
      const json = JSON.parse(fs.readFileSync(f, 'utf-8'))
      const id = json['@id']
      const deps = await expand(id)
      fs.writeFileSync(f.replace('.json', '.deps.json'), JSON.stringify(deps, null, 2))
    })
  })
}
main()
