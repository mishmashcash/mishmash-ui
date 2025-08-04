import { toBN } from 'web3-utils'

import relayerSchemas from './relayer'

const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true, schemas: relayerSchemas })

ajv.addKeyword('BN', {
  validate: (schema, data) => {
    try {
      toBN(data)
      return true
    } catch (e) {
      return false
    }
  },
  errors: true
})

function getRelayerValidateFunction(netId) {
  switch (netId) {
    case 5201420:
      return ajv.getSchema('etnTestnetRelayer')
    case 52014:
      return ajv.getSchema('etnMainnetRelayer')
    default:
      return ajv.getSchema('defaultRelayer')
  }
}

export default {
  getRelayerValidateFunction
}
