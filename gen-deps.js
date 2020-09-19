import fs from 'fs'
import glob from 'glob'
import expand from './expand-dependencies-fs'

const main = () => {
  glob.dir('dtmi/**/*.json', (err, files) => {
    if (err) throw err
    files.forEach(f => {
      console.log('processing ' + f)
      const json = JSON.parse(fs.readFileSync(f, 'utf-8'))
      const id = json['@id']
      const deps = expand(id)
      fs.writeFileSync(f.replace('.json', '.deps.json'), JSON.stringify(deps, null, 2))
    })
  })
}
main()
