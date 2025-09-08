export const GET_STATISTIC = `
  query getStatistic($currency: String!, $amount: String!, $first: Int) {
    deposits(first: $first, orderBy: index, orderDirection: desc, where: { currency: $currency, amount: $amount }) {
      index
      timestamp
      blockNumber
    }
    _meta {
      block {
        number
      }
    }
  }
`

export const GET_WITHDRAWALS = `
  query getWithdrawals($currency: String!, $amount: String!, $first: Int, $fromBlock: Int!) {
    withdrawals(first: $first, orderBy: blockNumber, orderDirection: asc,
      where: { currency: $currency, amount: $amount, blockNumber_gte: $fromBlock }) {
        to
        fee
        nullifier
        timestamp
        blockNumber
        transactionHash
    }
    _meta {
      block {
        number
      }
    }
  }
`

export const GET_REGISTERED = `
  query getRelayers($first: Int, $fromBlock: Int) {
    relayers(first: $first, where: { blockRegistration_gte: $fromBlock }) {
      address
      ensName
      blockRegistration
    }
    _meta {
      block {
        number
      }
    }
  }
`

export const GET_DEPOSITS = `
  query getDeposits($currency: String!, $amount: String!, $first: Int, $fromBlock: Int) {
    deposits(first: $first, orderBy: index, orderDirection: asc, where: { amount: $amount, currency: $currency, blockNumber_gte: $fromBlock }) {
      index
      timestamp
      commitment
      blockNumber
      transactionHash
    }
    _meta {
      block {
        number
      }
    }
  }
`

export const GET_NOTE_ACCOUNTS = `
  query getNoteAccount($address: String!) {
    noteAccounts(where: { address: $address }) {
      index
      address
      encryptedAccount
    }
    _meta {
      block {
        number
      }
    }
  }
`

export const GET_ENCRYPTED_NOTES = `
  query getEncryptedNotes($first: Int, $fromBlock: Int) {
    encryptedNotes(first: $first, orderBy: blockNumber, orderDirection: asc, where: { blockNumber_gte: $fromBlock }) {
      index
      blockNumber
      encryptedNote
      transactionHash
    }
    _meta {
      block {
        number
      }
    }
  }
`

export const GET_DELEGATORS = `
  query getActiveDelegators($address: String!) {
    activeDelegators(where: { address: $address }) {
      delegator
      transactionHash
    }
  }
`
