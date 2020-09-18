import { expand } from './expand-dependencies.js'

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
    const button2 = gbid('search2')
    const query = gbid('q')
    button.onclick = async () => {
      bindTemplate('models-list-template', '', 'rendered')
      const model = await expand(query.value)
      bindTemplate('models-list-template', JSON.stringify(model, null, 2), 'rendered')
    }
    button2.onclick = async () => {
      const modelResolver = 'https:model-resolver.azurewebsites.net/api/expand?id='
      bindTemplate('models-iframe-template', `${modelResolver}${query.value}`, 'rendered')
    }
  }
  init()
})()
