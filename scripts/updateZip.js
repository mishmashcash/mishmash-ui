import { uniqBy } from 'lodash'

import networkConfig from '../networkConfig'
import { loadZippedEvents, zip } from './helpers'

const EVENTS_PATH = './static/events/'
const EVENTS = ['Deposit', 'Withdrawal']

function updateEncrypted(netId) {
  try {
    const file = `${EVENTS_PATH}encrypted_notes_${netId}.json`

    zip(file)
  } catch {}
}
async function updateCommon(netId) {
  const { nativeCurrency, tokens } = networkConfig[`netId${netId}`]

  console.log(Object.keys(tokens[nativeCurrency].instanceAddress))
  for await (const type of EVENTS) {
    for await (const instance of Object.keys(tokens[nativeCurrency].instanceAddress)) {
      console.warn('instance', instance)
      const filename = `${type.toLowerCase()}s_${netId}_${nativeCurrency}_${instance}.json`
      const isSaved = zip(`${EVENTS_PATH}${filename}`)
      if (isSaved) {
        try {
          await testCommon(netId, type, filename)
        } catch (err) {
          console.error(err.message)
        }
      }
    }
  }
}

async function testCommon(netId, type, filename) {
  const { deployedBlock } = networkConfig[`netId${netId}`]

  const cachedEvents = await loadZippedEvents({
    name: filename,
    directory: EVENTS_PATH,
    deployedBlock
  })

  console.log('cachedEvents', cachedEvents.events.length, type)

  let events = cachedEvents.events
  if (type === 'Withdrawal') {
    events = uniqBy(cachedEvents.events, 'nullifierHash')
  } else if (type === 'Deposit') {
    events = cachedEvents.events
      .sort((a, b) => a.leafIndex - b.leafIndex)
      .filter((e, index) => Number(e.leafIndex) === index)
      .sort((a, b) => b.leafIndex - a.leafIndex)
  }
  if (events.length !== cachedEvents.events.length) {
    console.error('events.length', events.length)
    console.error('cachedEvents.events.length', cachedEvents.events.length)
    throw new Error(`Duplicates was detected in ${filename} (${events.length - cachedEvents.events.length})`)
  }
}

async function main() {
  const NETWORKS = [52014, 5201420]

  for await (const netId of NETWORKS) {
    updateEncrypted(netId)
    await updateCommon(netId)
  }
}

main()
