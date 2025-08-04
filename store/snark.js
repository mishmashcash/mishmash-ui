/* eslint-disable no-console */
// import Web3 from 'web3'
import Jszip from 'jszip'
import axios from 'axios'

import { detectMob } from '@/utils'

const { IPFS_APP_HASH } = process.env

const groth16 = require('websnark/src/groth16')
const jszip = new Jszip()

function buildGroth16() {
  const isMobile = detectMob()
  const wasmMemory = isMobile ? 1000 : 2000
  return groth16({ wasmInitialMemory: wasmMemory })
}

async function getTornadoKeys(getProgress) {
  try {
    const keys = await Promise.all([
      download({ name: 'mishmash.json.zip', contentType: 'string' }),
      download({ name: 'mishmashProvingKey.bin.zip', contentType: 'arraybuffer', getProgress })
    ])
    return { circuit: JSON.parse(keys[0]), provingKey: keys[1] }
  } catch (err) {
    throw err
  }
}

async function fetchFile({ url, name, getProgress, id, retryAttempt = 0 }) {
  try {
    const response = await axios.get(`${url}/${name}`, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      onDownloadProgress: (progressEvent) => {
        if (typeof getProgress === 'function') {
          const progress = Math.round((progressEvent.loaded * 100) / 9626311)
          getProgress(progress)
        }
      }
    })

    return response
  } catch (err) {
    if (!id) {
      id = IPFS_APP_HASH
    }
    const knownResources = [
      url,
      `https://ipfs.io/ipfs/${id}`,
      `https://dweb.link/ipfs/${id}`,
      `https://gateway.pinata.cloud/ipfs/${id}`
    ]

    if (retryAttempt < knownResources.length) {
      const fallbackUrl = knownResources[retryAttempt]
      retryAttempt++

      const response = await fetchFile({ name, getProgress, retryAttempt, id, url: fallbackUrl })

      return response
    }
    throw err
  }
}
/**
 * Function to download
 * @param {*} name filename
 * @param {'base64'|'string'|'binarystring'|'text'|'blob'|'uint8array'|'arraybuffer'|'array'|'nodebuffer'} contentType type of the content.
 * @param getProgress function
 */
async function download({ name, contentType, getProgress, eventName = 'events' }) {
  try {
    // eslint-disable-next-line no-undef
    const prefix = __webpack_public_path__.slice(0, -7)
    // console.log('prefix', prefix)
    const response = await fetchFile({ getProgress, url: prefix, name })

    const zip = await jszip.loadAsync(response.data)
    const file = zip.file(name.replace(`${eventName}/`, '').slice(0, -4))

    const content = await file.async(contentType)

    return content
  } catch (err) {
    throw err
  }
}

export { getTornadoKeys, buildGroth16, download }
