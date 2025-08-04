import 'dotenv/config'

import fs from 'fs'
import Web3 from 'web3'

import networkConfig from '../networkConfig'
import INSTANCE_REGISTRY_ABI from '../abis/InstanceRegistry.abi.json'
import ERC20_ABI from '../abis/ERC20.abi.json'

const CONFIG_PATH = './networkConfig.js'
const STATIC_EVENTS_PATH = './static/events'
const STATIC_TREES_PATH = './static/trees'
const DEPLOYMENT_PATH = require('path').resolve(__dirname, '../../core/deployments/')

const enabledChains = ['52014', '5201420']

async function main(netId) {
  const config = networkConfig
  const { http, ws } = config[`netId${netId}`].scriptRpcUrls

  const provider = ws ? new Web3.providers.WebsocketProvider(ws) : new Web3.providers.HttpProvider(http)

  // Usage:
  const deploymentData = getMostRecentDeploymentFile(netId)
  if (!deploymentData) {
    throw new Error(`No deployment found for network ${netId}`)
  }

  const web3 = new Web3(provider)

  const instanceRegistry = deploymentData.contracts.InstanceRegistryProxy.address
  const instanceRegistryContract = new web3.eth.Contract(INSTANCE_REGISTRY_ABI, instanceRegistry)

  const allInstances = await instanceRegistryContract.methods.getAllInstances().call()

  const processedInstances = {
    etn: {
      instanceAddress: {},
      symbol: 'ETN',
      decimals: 18
    }
  }

  const cachedTokens = {}

  for (const instance of allInstances) {
    // ENABLED
    if (instance.instance.state === '1') {
      if (!instance.instance.isERC20) {
        const parsedValue = web3.utils.fromWei(instance.instance.denomination, 'ether')
        processedInstances.etn.instanceAddress[parsedValue] = instance.addr
      } else {
        if (!cachedTokens[instance.instance.token]) {
          const erc20Contract = new web3.eth.Contract(ERC20_ABI, instance.instance.token)
          const tokenSymbol = await erc20Contract.methods.symbol().call()
          const decimals = await erc20Contract.methods.decimals().call()

          cachedTokens[instance.instance.token] = tokenSymbol.toLowerCase()

          processedInstances[tokenSymbol.toLowerCase()] = {
            instanceAddress: {},
            tokenAddress: instance.instance.token,
            symbol: tokenSymbol,
            decimals: parseInt(decimals),
            gasLimit: '80000'
          }
        }

        const token = cachedTokens[instance.instance.token]
        const decimals = processedInstances[token].decimals
        const parsedValue = web3.utils
          .toBN(instance.instance.denomination)
          .div(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)))
          .toString()
        processedInstances[token].instanceAddress[parsedValue] = instance.addr
      }
    }
  }

  config[`netId${netId}`].deployedBlock = deploymentData.contracts.MishMashRouter.blockNumber
  config[`netId${netId}`].relayerRegistryContract = deploymentData.contracts.RelayerRegistryProxy.address
  config[`netId${netId}`].instanceRegistryContract = deploymentData.contracts.InstanceRegistryProxy.address
  config[`netId${netId}`].aggregatorContract = deploymentData.contracts.Aggregator.address
  config[`netId${netId}`].echoContractAccount = deploymentData.contracts.Echoer.address

  config[`netId${netId}`].tokens = processedInstances

  config[`netId${netId}`].constants.GOVERNANCE_BLOCK = deploymentData.contracts.GovernanceProxy.blockNumber
  config[`netId${netId}`].constants.NOTE_ACCOUNT_BLOCK = deploymentData.contracts.Echoer.blockNumber
  config[`netId${netId}`].constants.ENCRYPTED_NOTES_BLOCK = deploymentData.contracts.Echoer.blockNumber
  config[`netId${netId}`].constants.RELAYER_REGISTRY_BLOCK =
    deploymentData.contracts.RelayerRegistryProxy.blockNumber

  config[`netId${netId}`]['mishmash-router'] = deploymentData.contracts.MishMashRouter.address
  config[`netId${netId}`]['governance.contract.mishmash.cash'] =
    deploymentData.contracts.GovernanceProxy.address
  config[`netId${netId}`]['mash.contract.mishmash.cash'] = deploymentData.contracts.MASH.address

  // console.log('config', config)
  const configJson = JSON.stringify(config, null, 2).replaceAll('"', "'") + '\n'
  fs.writeFileSync(CONFIG_PATH, 'export default ' + configJson)

  deleteAllFilesInDir(STATIC_EVENTS_PATH)
  deleteAllFilesInDir(STATIC_TREES_PATH)

  provider.disconnect()
}

// Find the most recent deployment JSON for the given netId
function getMostRecentDeploymentFile(netId) {
  const files = fs
    .readdirSync(DEPLOYMENT_PATH)
    .filter((f) => f.startsWith('deployment_') && f.endsWith('.json'))

  const fileMap = {}
  const candidates = []
  for (const file of files) {
    const filePath = DEPLOYMENT_PATH + '/' + file
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      if (data.network === netId.toString()) {
        fileMap[data.timestamp] = file
        candidates.push(data)
      }
    } catch (e) {
      // skip invalid files
      continue
    }
  }
  candidates.sort((a, b) => b.timestamp - a.timestamp)

  console.log('Using Deployment:', fileMap[candidates[0].timestamp])

  return candidates[0]
}

// Delete all files within STATIC_EVENTS_PATH and STATIC_TREES_PATH
function deleteAllFilesInDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath)
    for (const file of files) {
      const filePath = dirPath + '/' + file
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath)
      }
    }
  }
}

async function start() {
  const [, , , chain] = process.argv
  if (!enabledChains.includes(chain)) {
    throw new Error(`Supported chain ids ${enabledChains.join(', ')}`)
  }

  await main(chain)
}

start()
