import { dtmi2path } from './dtmi2path.js'

(async () => {
  /**
   * @param {string} id - element id
   * @returns {HTMLElement}
   */
  const gbid = (id) => {
    const el = document.getElementById(id)
    if (el === null) {
      throw new Error('element not found: ' + id)
    }
    return el
  }
  /**
   * @param {string} template
   * @param {Array<modelInfo>} models
   * @param {string} target
   */
  const bindTemplate = (template, models, target) => {
    gbid(target).innerHTML = Mustache.render(gbid(template).innerHTML, models)
  }

  const model = {}
  let docs = []

  const addComp2Model = (name, cschema) => {
    const comp = docs.filter(doc => doc['@id'] === cschema)[0]
    const compPos = model.Components.push({ properties: [], telemetry: [], commands: [] })
    const compItem = model.Components[compPos - 1]
    compItem.name = name
    compItem.schema = cschema
    const { modelFolder, fileName } = dtmi2path(cschema)
    const url = `${modelFolder}/${fileName}`
    compItem.schemaUrl = url

    if (Array.isArray(comp.contents)) {
      comp.contents.forEach(c => {
        if (Array.isArray(c['@type'])) {
          if (c['@type'].filter(t => t === 'Telemetry').length > 0) compItem.telemetry.push(c)
          if (c['@type'].filter(t => t === 'Property').length > 0) compItem.properties.push(c)
        } else {
          switch (c['@type']) {
            case 'Telemetry':
              compItem.telemetry.push(c)
              break
            case 'Property':
              compItem.properties.push(c)
              break
            case 'Command':
              compItem.commands.push(c)
              break
          }
        }
      })
    }
  }
  const init = () => {
    const button = gbid('search')
    button.onclick = async () => {
      model.resolveStatus = ''
      const dtmi = gbid('q').value
      bindTemplate('model-template', '', 'rendered')

      const { modelFolder, fileName } = dtmi2path(dtmi)
      const url = `${modelFolder}/${fileName.replace('.json', '.deps.json')}`

      model.resolveStatus = `Resolving ${dtmi} with ${url}..`
      docs = await (await window.fetch(url)).json()
      model.resolveStatus = `Resolving ${dtmi} with ${url} OK !!`

      const rootDoc = docs.filter(doc => doc['@id'] === dtmi)[0]
      model.id = rootDoc['@id']
      model.displayName = rootDoc.displayName
      model.Components = []
      addComp2Model('_default', model.id)
      if (Array.isArray(rootDoc.contents)) {
        const components = rootDoc.contents.filter(c => c['@type'] === 'Component')
        components.forEach( c => {
          if (typeof c.schema !== 'object') {
            addComp2Model(c.name, c.schema)
          }
        })
      }

      console.log(model)
      bindTemplate('model-template', model, 'rendered')
    }
  }
  init()
})()
