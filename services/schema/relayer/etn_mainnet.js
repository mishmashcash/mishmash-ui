import { addressType } from '@/constants'

const statusSchema = {
  type: 'object',
  properties: {
    rewardAccount: addressType,
    instances: {
      type: 'object',
      properties: {
        etn: {
          type: 'object',
          properties: {
            instanceAddress: {
              type: 'object',
              properties: {
                '1000': addressType,
                '10000': addressType,
                '100000': addressType,
                '1000000': addressType
              },
              required: ['1000', '10000', '100000', '1000000']
            },
            decimals: { enum: [18] }
          },
          required: ['instanceAddress', 'decimals']
        }
      },
      required: ['etn']
    },
    netId: { type: 'integer', required: ['52014'] },
    tornadoServiceFee: { type: 'number', maximum: 20, minimum: 0 },
    health: {
      type: 'object',
      properties: {
        status: { const: 'true' },
        error: { type: 'string' }
      },
      required: ['status']
    },
    currentQueue: { type: 'number' }
  },
  required: ['rewardAccount', 'instances', 'netId', 'tornadoServiceFee', 'health']
}

export { statusSchema }
