import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'

import {
  GET_DEPOSITS,
  GET_STATISTIC,
  GET_REGISTERED,
  GET_WITHDRAWALS,
  GET_NOTE_ACCOUNTS,
  GET_ENCRYPTED_NOTES
} from './queries'

const isEmptyArray = (arr) => !Array.isArray(arr) || !arr.length

const first = 1000

const link = ({ getContext }) => {
  const { chainId } = getContext()
  return CHAIN_GRAPH_URLS[chainId]
}

const CHAIN_GRAPH_URLS = {
  52014: process.env.GRAPHQL_HOST + '/graphql/mainnet',
  5201420: process.env.GRAPHQL_HOST + '/graphql/testnet'
}

const defaultOptions = {
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
}

const client = new ApolloClient({
  uri: link,
  cache: new InMemoryCache(),
  defaultOptions
})

async function getStatistic({ currency, amount, netId }) {
  try {
    const { data } = await client.query({
      context: {
        chainId: netId
      },
      query: gql(GET_STATISTIC),
      variables: {
        currency,
        first: 10,
        amount: String(amount)
      }
    })

    if (!data) {
      console.log('No statistic data from graph')
      return {
        lastSyncBlock: '',
        events: []
      }
    }

    const { deposits, _meta } = data

    const lastSyncBlock = _meta.block.number

    const events = deposits
      .map((e) => ({
        timestamp: e.timestamp,
        leafIndex: Number(e.index),
        blockNumber: Number(e.blockNumber)
      }))
      .reverse()

    const [lastEvent] = events.slice(-1)

    return {
      lastSyncBlock: lastEvent?.blockNumber >= lastSyncBlock ? lastEvent.blockNumber + 1 : lastSyncBlock,
      events
    }
  } catch {
    return {
      lastSyncBlock: '',
      events: []
    }
  }
}

async function getAllRegisters(fromBlock, netId) {
  try {
    const { data } = await client.query({
      context: {
        chainId: netId
      },
      query: gql(GET_REGISTERED),
      variables: { first, fromBlock }
    })

    const relayers = data?.relayers

    if (!relayers) {
      return { lastSyncBlock: '', events: [] }
    }

    const lastSyncBlock = data._meta.block.number

    return { lastSyncBlock, events: relayers }
  } catch {
    return { lastSyncBlock: '', events: [] }
  }
}
async function getAllDeposits({ currency, amount, fromBlock, netId }) {
  try {
    let deposits = []

    let lastSyncBlock
    while (true) {
      const { data } = await client.query({
        context: {
          chainId: netId
        },
        query: gql(GET_DEPOSITS),
        variables: { currency, amount: String(amount), first, fromBlock }
      })

      let result = data?.deposits || []
      lastSyncBlock = data?._meta?.block?.number

      if (isEmptyArray(result)) {
        break
      }

      if (result.length < 900) {
        deposits = deposits.concat(result)
        break
      }

      const [lastEvent] = result.slice(-1)

      result = result.filter((e) => e.blockNumber !== lastEvent.blockNumber)
      fromBlock = Number(lastEvent.blockNumber)

      deposits = deposits.concat(result)
    }

    if (!deposits) {
      return {
        lastSyncBlock: '',
        events: []
      }
    }

    const data = deposits.map((e) => ({
      timestamp: e.timestamp,
      commitment: e.commitment,
      leafIndex: Number(e.index),
      blockNumber: Number(e.blockNumber),
      transactionHash: e.transactionHash
    }))

    const [lastEvent] = data.slice(-1)

    return {
      events: data,
      lastSyncBlock: lastEvent?.blockNumber >= lastSyncBlock ? lastEvent.blockNumber + 1 : lastSyncBlock
    }
  } catch {
    return {
      lastSyncBlock: '',
      events: []
    }
  }
}

async function getAllWithdrawals({ currency, amount, fromBlock, netId }) {
  try {
    let withdrawals = []
    let lastSyncBlock

    while (true) {
      const { data } = await client.query({
        context: {
          chainId: netId
        },
        query: gql(GET_WITHDRAWALS),
        variables: { currency, amount: String(amount), fromBlock, first }
      })

      let result = data?.withdrawals || []
      lastSyncBlock = data?._meta?.block?.number

      if (isEmptyArray(result)) {
        break
      }

      if (result.length < 900) {
        withdrawals = withdrawals.concat(result)
        break
      }

      const [lastEvent] = result.slice(-1)

      result = result.filter((e) => e.blockNumber !== lastEvent.blockNumber)
      fromBlock = Number(lastEvent.blockNumber)

      withdrawals = withdrawals.concat(result)
    }

    if (!withdrawals) {
      return {
        lastSyncBlock: '',
        events: []
      }
    }

    const data = withdrawals.map((e) => ({
      to: e.to,
      fee: e.fee,
      timestamp: e.timestamp,
      nullifierHash: e.nullifier,
      blockNumber: Number(e.blockNumber),
      transactionHash: e.transactionHash
    }))

    const [lastEvent] = data.slice(-1)

    return {
      events: data,
      lastSyncBlock: lastEvent?.blockNumber >= lastSyncBlock ? lastEvent.blockNumber + 1 : lastSyncBlock
    }
  } catch {
    return {
      lastSyncBlock: '',
      events: []
    }
  }
}

async function getNoteAccounts({ address, netId }) {
  try {
    const { data } = await client.query({
      context: {
        chainId: netId
      },
      query: gql(GET_NOTE_ACCOUNTS),
      variables: { address }
    })

    if (!data) {
      return {
        lastSyncBlock: '',
        events: []
      }
    }

    return {
      lastSyncBlock: data._meta.block.number,
      events: data.noteAccounts
    }
  } catch {
    return {
      lastSyncBlock: '',
      events: []
    }
  }
}

async function getAllEncryptedNotes({ fromBlock, netId }) {
  try {
    let encryptedNotes = []
    let lastSyncBlock

    while (true) {
      const { data } = await client.query({
        context: {
          chainId: netId
        },
        query: gql(GET_ENCRYPTED_NOTES),
        variables: { fromBlock, first }
      })

      let result = data?.encryptedNotes || []
      lastSyncBlock = data?._meta?.block?.number

      if (isEmptyArray(result)) {
        break
      }

      if (result.length < 900) {
        encryptedNotes = encryptedNotes.concat(result)
        break
      }

      const [lastEvent] = result.slice(-1)

      result = result.filter((e) => e.blockNumber !== lastEvent.blockNumber)
      fromBlock = Number(lastEvent.blockNumber)

      encryptedNotes = encryptedNotes.concat(result)

      if (isEmptyArray(result)) {
        break
      }
    }

    if (!encryptedNotes) {
      return {
        lastSyncBlock: '',
        events: []
      }
    }

    const data = encryptedNotes.map((e) => ({
      txHash: e.transactionHash,
      encryptedNote: e.encryptedNote,
      transactionHash: e.transactionHash,
      blockNumber: Number(e.blockNumber)
    }))

    const [lastEvent] = data.slice(-1)

    return {
      events: data,
      lastSyncBlock: lastEvent?.blockNumber >= lastSyncBlock ? lastEvent.blockNumber + 1 : lastSyncBlock
    }
  } catch {
    return {
      lastSyncBlock: '',
      events: []
    }
  }
}

export default {
  getStatistic,
  getAllDeposits,
  getNoteAccounts,
  getAllRegisters,
  getAllWithdrawals,
  getAllEncryptedNotes
}
