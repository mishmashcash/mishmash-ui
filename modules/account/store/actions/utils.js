// import { graph } from '@/services'
import networkConfig from '@/networkConfig'

function createMutation({ commit, rootState }, { type, payload }) {
  const { netId } = rootState.metamask

  commit(type, { ...payload, netId })
}

function clearState({ dispatch }, { key }) {
  dispatch('createMutation', {
    type: 'CLEAR_STATE',
    payload: { key }
  })
}

async function getEventsFromBlockPart({ echoContract, address, currentBlockNumber, netId }) {
  try {
    // const { events: graphEvents, lastSyncBlock } = await graph.getNoteAccounts({ address, netId })

    // if (graphEvents.length) {
    //   return graphEvents
    // }

    let { NOTE_ACCOUNT_BLOCK: fromBlock } = networkConfig[`netId${netId}`].constants
    // if (lastSyncBlock) {
    //   fromBlock = lastSyncBlock
    // }

    const blockDifference = Math.ceil(currentBlockNumber - fromBlock)

    const blockRange = 4950

    let numberParts = blockDifference === 0 ? 1 : Math.ceil(blockDifference / blockRange)
    const part = Math.ceil(blockDifference / numberParts)

    let events = []

    let toBlock = fromBlock + part

    if (toBlock >= currentBlockNumber) {
      toBlock = 'latest'
      numberParts = 1
    }

    for (let i = 0; i < numberParts; i++) {
      const partOfEvents = await echoContract.getEvents({
        fromBlock,
        toBlock,
        address
      })
      if (partOfEvents) {
        events = events.concat(
          partOfEvents.map((event) => ({
            blockNumber: event.blockNumber,
            address: event.returnValues.who,
            encryptedAccount: event.returnValues.data
          }))
        )
      }
      fromBlock = toBlock
      toBlock += part
    }

    // Prefer the earlier note account if multiple
    events = events.sort((a, b) => b.blockNumber - a.blockNumber)

    return events
  } catch (err) {
    console.log(`getEventsFromBlock has error: ${err.message}`)
    return false
  }
}

export { clearState, createMutation, getEventsFromBlockPart }
