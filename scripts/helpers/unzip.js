import fs from 'fs'
import Jszip from 'jszip'
import Web3 from 'web3'
import networkConfig from '../../networkConfig'

const jszip = new Jszip()

export async function unzip({ name, directory, contentType }) {
  const path = `${directory}${name}.zip`.toLowerCase()

  const data = fs.readFileSync(path)
  const zip = await jszip.loadAsync(data)

  const file = zip.file(
    path
      .replace(directory, '')
      .slice(0, -4)
      .toLowerCase()
  )

  const content = await file.async(contentType)

  return content
}

export async function loadZippedEvents({ name, directory, deployedBlock }) {
  try {
    const module = await unzip({ contentType: 'string', directory, name })

    if (module) {
      const events = JSON.parse(module)

      const [lastEvent] = events.sort((a, b) => (b.block || b.blockNumber) - (a.block || a.blockNumber))
      const lastBlock = lastEvent.block || lastEvent.blockNumber

      return {
        events,
        lastBlock
      }
    }
  } catch (err) {
    if (!err.message.includes('no such file')) {
      console.error(`Method loadZippedEvents has error: ${err.message}`)
    }

    return {
      events: [],
      lastBlock: deployedBlock
    }
  }
}

export async function getPastEvents({ type, fromBlock, netId, events, contractAttrs }) {
  let downloadedEvents = events

  const { http, ws } = networkConfig[`netId${netId}`].scriptRpcUrls

  const provider = ws ? new Web3.providers.WebsocketProvider(ws) : new Web3.providers.HttpProvider(http)
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(...contractAttrs)

  const currentBlockNumber = await web3.eth.getBlockNumber()
  const blockDifference = Math.ceil(currentBlockNumber - fromBlock)

  const blockRange = 3000

  let chunksCount = blockDifference === 0 ? 1 : Math.ceil(blockDifference / blockRange)
  const chunkSize = Math.ceil(blockDifference / chunksCount)

  let toBlock = fromBlock + chunkSize

  if (fromBlock < currentBlockNumber) {
    if (toBlock >= currentBlockNumber) {
      toBlock = currentBlockNumber
      chunksCount = 1
    }

    console.log(`Fetching ${type}, chainId - ${netId}`, `chunksCount - ${chunksCount}`)
    for (let i = 0; i < chunksCount; i++)
      try {
        console.log(`fromBlock - ${fromBlock} `)
        console.log(`toBlock   - ${toBlock}`)

        const eventsChunk = await contract.getPastEvents(type, { fromBlock, toBlock })

        if (eventsChunk) {
          downloadedEvents = downloadedEvents.concat(eventsChunk)
          console.log('downloaded events count - ', eventsChunk.length)
          console.log('____________________________________________')
        }
        fromBlock = toBlock
        toBlock += chunkSize
      } catch (err) {
        console.log('getPastEvents events', `chunk number - ${i}, has error: ${err.message}`)
        chunksCount = chunksCount + 1
      }
  }

  if (ws) {
    provider.disconnect()
  }

  return downloadedEvents
}
