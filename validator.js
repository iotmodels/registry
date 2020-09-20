(() => {
  const valFunc = ' https://model-validator.azurewebsites.net/api/Validate'
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

  const button = gbid('valButton')
  button.onclick = async () => {
    const input = gbid('model')
    const model = input.value
    const response = await (await window.fetch(valFunc, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: model
    })).text()
    gbid('results').innerText = response
  }
})()
