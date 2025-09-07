import { BigNumber as BN } from 'bignumber.js'

import { graph } from '@/services'
import networkConfig from '@/networkConfig'

import AggregatorABI from '@/abis/Aggregator.abi.json'
import RelayerRegistryABI from '@/abis/RelayerRegistry.abi.json'

class RelayerRegister {
  constructor(provider, netId) {
    this.provider = provider

    this.netId = netId
    this.$indexedDB = window.$nuxt.$indexedDB(this.netId)
    this.networkConfig = networkConfig['netId' + netId]

    const { relayerRegistryContract, aggregatorContract } = this.networkConfig

    this.aggregator = new this.provider.Contract(AggregatorABI, aggregatorContract)
    this.relayerRegistry = new this.provider.Contract(RelayerRegistryABI, relayerRegistryContract)

    const that = this
    this.relayerRegistry.methods
      .minStakeAmount()
      .call()
      .then((minStakeAmount) => {
        that.minStakeAmount = minStakeAmount
      })
  }

  fetchEvents = async (fromBlock, toBlock) => {
    if (this.relayerRegistry && (fromBlock <= toBlock || (fromBlock !== 'latest' && toBlock === 'latest'))) {
      try {
        const registeredEventsPart = await this.relayerRegistry.getPastEvents('RelayerRegistered', {
          fromBlock,
          toBlock
        })

        return registeredEventsPart
      } catch (error) {
        const midBlock = (fromBlock + toBlock) >> 1

        if (midBlock - fromBlock < 2) {
          throw new Error(`error fetching events: ${error.message}`)
        }

        const arr1 = await this.fetchEvents(fromBlock, midBlock)
        const arr2 = await this.fetchEvents(midBlock + 1, toBlock)
        return [...arr1, ...arr2]
      }
    }
    return []
  }

  saveEvents = async ({ events, lastSyncBlock, storeName }) => {
    try {
      if (this.$indexedDB.isBlocked) {
        return
      }

      await this.$indexedDB.putItem({
        data: {
          blockNumber: lastSyncBlock,
          name: storeName
        },
        storeName: 'lastEvents'
      })

      if (events.length) {
        this.$indexedDB.createMultipleTransactions({ data: events, storeName })
      }
    } catch (err) {
      console.error(`saveEvents has error: ${err.message}`)
    }
  }

  getCachedData = async () => {
    let blockFrom = this.networkConfig.constants.RELAYER_REGISTRY_BLOCK

    try {
      const blockTo = await this.provider.getBlockNumber()

      const cachedEvents = await this.$indexedDB.getAll({
        storeName: 'register_events'
      })

      const lastBlock = await this.$indexedDB.getFromIndex({
        indexName: 'name',
        key: 'register_events',
        storeName: 'lastEvents'
      })

      if (lastBlock) {
        blockFrom = blockTo >= lastBlock.blockNumber ? lastBlock.blockNumber + 1 : blockTo
      }

      return { blockFrom, blockTo, cachedEvents }
    } catch {
      return { blockFrom, blockTo: 'latest', cachedEvents: [] }
    }
  }

  fetchRelayers = async () => {
    // eslint-disable-next-line prefer-const
    let { blockFrom, blockTo, cachedEvents } = await this.getCachedData()
    let allRelayers = cachedEvents

    // console.log('FetchRelayers - DB Cached relayers', allRelayers)

    if (blockFrom !== blockTo) {
      const graphRelayersEvents = await graph.getAllRegisters(blockFrom, this.netId)

      // console.log('FetchRelayers - From GraphQL', graphRelayersEvents)

      let relayers = {
        lastSyncBlock: graphRelayersEvents.lastSyncBlock,
        events: graphRelayersEvents.events.map((el) => ({
          hostName: el.ensName,
          relayerAddress: el.address,
          stakedAmount: el.stakedAmount,
          chainId: this.netId
        }))
      }

      const isGraphLate = relayers.lastSyncBlock && blockTo > Number(relayers.lastSyncBlock)

      if (isGraphLate) {
        // console.log('FetchRelayers - Graph Is Late', isGraphLate, relayers.lastSyncBlock, blockTo)
        blockFrom = relayers.lastSyncBlock
      }

      if (!relayers.events.length || isGraphLate) {
        const multicallEvents = await this.fetchEvents(blockFrom, blockTo)
        const eventsRelayers = multicallEvents.map(({ returnValues }) => ({
          hostName: returnValues.hostName,
          relayerAddress: returnValues.relayerAddress,
          stakedAmount: returnValues.stakedAmount,
          chainId: this.netId
        }))

        relayers = {
          lastSyncBlock: blockTo,
          events: relayers.events.concat(eventsRelayers)
        }
      }

      const newRelayers = {
        lastSyncBlock: blockTo,
        events: relayers.events
      }

      await this.saveEvents({ storeName: 'register_events', ...newRelayers })
      allRelayers = allRelayers.concat(newRelayers.events)
    }

    return allRelayers
  }

  filterRelayer = (acc, curr, relayer) => {
    const hostname = curr.hostName
    const isHostWithProtocol = hostname.includes('http')

    const isOwner = relayer.relayerAddress === curr.relayerAddress
    const hasMinBalance = new BN(curr.balance).gte(this.minStakeAmount)

    if (hostname && !isHostWithProtocol && isOwner && curr.isRegistered && hasMinBalance) {
      acc.push({
        name: curr.relayerName,
        hostname,
        stakeBalance: curr.balance,
        relayerAddress: relayer.relayerAddress
      })
    } else {
      console.error(`INVALID Relayer: ${relayer.relayerAddress}: `, {
        isOwner,
        hostname,
        isHasMinBalance: hasMinBalance,
        isRegistered: curr.isRegistered,
        isHostWithoutProtocol: !isHostWithProtocol
      })
    }

    return acc
  }

  getValidRelayers = async (relayers, chainId) => {
    const chainFilteredRelayers = relayers.filter((r) => r.chainId === chainId)
    const relayerAddresses = chainFilteredRelayers.map((r) => r.relayerAddress)

    const relayersData = await this.aggregator.methods.relayersData(relayerAddresses).call()

    console.log('Relayers - Statuses:', relayersData)

    const validRelayers = relayersData.reduce(
      (acc, curr, index) => this.filterRelayer(acc, curr, chainFilteredRelayers[index]),
      []
    )

    return validRelayers
  }

  getRelayers = async (netId) => {
    const relayers = await this.fetchRelayers()
    const validRelayers = await this.getValidRelayers(relayers, netId)
    return validRelayers
  }
}

export const relayerRegisterService = async (provider) => {
  let chainId
  if (provider.eth && typeof provider.eth.getChainId === 'function') {
    chainId = await provider.eth.getChainId()
  } else if (provider.currentProvider && provider.currentProvider.chainId) {
    chainId = provider.currentProvider.chainId
  }
  // You can now use chainId as needed
  return new RelayerRegister(provider.eth, chainId)
}
