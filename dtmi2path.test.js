import { dtmi2path } from './dtmi2path.js'

test('dtmi to path', () => {
  expect(dtmi2path('dtmi:com:example:Thermostat;1')).toBe('dtmi/com/example/thermostat-1.json')
})
