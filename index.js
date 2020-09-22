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

  const init = () => {
    const button = gbid('search')
    button.onclick = async () => {
      const dtmi = gbid('q').value
      bindTemplate('model-template', '', 'rendered')
      const { modelFolder, fileName } = dtmi2path(dtmi)
      const url = `${modelFolder}/${fileName.replace('.json', '.deps.json')}`
      const docs = await (await window.fetch(url)).json()
      const rootDoc = docs.filter(doc => doc['@id'] === dtmi)[0]

      const addComp2Model = (name, cschema) => {
        const comp = docs.filter(doc => doc['@id'] === cschema)[0]
        const compPos = model.Components.push({ properties: [], telemetry: [], commands: [] })
        const compItem = model.Components[compPos - 1]
        compItem.name = name
        compItem.schema = cschema
        const { modelFolder, fileName } = dtmi2path(dtmi)
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

      const model = {}
      model.id = rootDoc['@id']
      model.displayName = rootDoc.displayName
      model.Default = { properties: [], telemetry: [], commands: [] }
      model.Default.schemaUrl = `${modelFolder}/${fileName}`
      model.Components = []
      if (Array.isArray(rootDoc.contents)) {
        rootDoc.contents.forEach(c => {
          switch (c['@type']) {
            case 'Telemetry':
              model.Default.telemetry.push(c)
              break
            case 'Property':
              model.Default.properties.push(c)
              break
            case 'Command':
              model.Default.commands.push(c)
              break
            case 'Component':
              if (typeof c.schema !== 'object') {
                addComp2Model(c.name, c.schema)
              }
              break
          }
        })
      }
      console.log(model)
      bindTemplate('model-template', model, 'rendered')
    }
  }
  init()
})()
