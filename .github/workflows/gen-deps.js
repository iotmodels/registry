import fs from 'fs'
import { argv } from 'process'
import { expand } from '../../expand-dependencies-fs.js'

(async () => {
  for (let i = 2; i < argv.length; i++) {
    const file = argv[i]
    if (file.indexOf('dtmi') >= 0) {
      console.log('\nchecking: ' + file)
      if (fs.existsSync(file)) {
        const json = JSON.parse(fs.readFileSync(file, 'utf-8'))
        const id = json['@id']
        const deps = await expand(id)
        fs.writeFileSync(file.replace('.json', '.deps.json'), JSON.stringify(deps, null, 2))
      } else {
        console.error('File not found: ' + file)
      }
    }
  }
})()