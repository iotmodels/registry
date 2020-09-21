import * as fetch from 'node-fetch'
import { dtmi2path } from './repo-convention.js'

(async () => {
  const repo = 'https://iotmodels.github.io/registry'
  const dtmi = 'dtmi:rido:device:sample;3'
  const { modelFolder, fileName } = dtmi2path(dtmi)
  const url = `${repo}/${modelFolder}/${fileName.replace('.json', '.deps.json')}`

  console.log(url)
  /**
   * @type {Array<any> docs}
   */
  const docs = await (await fetch.default(url)).json()

  const printInterace = i => {
    console.log(`${i['@id']} - ${i.displayName}`)
    if (Array.isArray(i.contents)) {
      i.contents.forEach(c => {
        switch (c['@type']) {
          case 'Telemetry':
            console.log(`Telemetry: ${c.name} ${c.schema}`)
            break
          case 'Property':
            console.log(`Property: ${c.name} ${c.schema} ${c.writable || 'false'} `)
            break
          case 'Command':
            console.log(`Command: ${c.name} `)
            break
          case 'Component':
            console.log(`Component: ${c.name} `)
            printComponent(c.schema)
            break
        }
      })
    }
  }

  const printComponent = c => {
    if (typeof c !== 'object') {
      const iface = docs.filter(doc => doc['@id'] === c)[0]
      printInterace(iface)
    }
  }

  const rootDoc = docs.filter(doc => doc['@id'] === dtmi)[0]
  printInterace(rootDoc)
})()
