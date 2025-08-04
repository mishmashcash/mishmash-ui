export default {
  netId52014: {
    rpcCallRetryAttempt: 15,
    gasPrices: {
      instant: 80,
      fast: 50,
      standard: 25,
      low: 8
    },
    nativeCurrency: 'etn',
    currencyName: 'ETN',
    explorerUrl: {
      tx: 'https://blockexplorer.electroneum.com/tx/',
      address: 'https://blockexplorer.electroneum.com/address/',
      block: 'https://blockexplorer.electroneum.com/block/'
    },
    merkleTreeHeight: 20,
    emptyElement: '21663839004416932945382355908790599225266501822907911457504978515578255421292',
    networkName: 'Electroneum',
    deployedBlock: 8838360,
    rpcUrls: {
      Ankr: {
        name: 'Ankr',
        url: 'https://rpc.ankr.com/electroneum'
      }
    },
    scriptRpcUrls: {
      http: 'https://rpc.ankr.com/electroneum'
    },
    multicall: '0xf6bd2414715713f52C74fce8341DA12221ac7446',
    relayerRegistryContract: '0xe1a5f69B43A316a4a3430545a17782D32ad11a4b',
    instanceRegistryContract: '0x79B9dbda0394366C97E30e203B56B24100175617',
    echoContractAccount: '0x3dC86a3391E13765941321C9e0465997a7C55342',
    aggregatorContract: '0x1eED157448Da215754E1f3B23670348DF4Dc5190',
    ensSubdomainKey: 'mishmash',
    tokens: {
      etn: {
        instanceAddress: {
          '1000': '0x7f7679bEb2bEeb15328241415DC66D96FAE52195',
          '10000': '0xF174B117BbE4cf274eD467B21C41Ad56c3744A0a',
          '100000': '0xf344F3DA57BdE1378BD096476E80bf048d026F89',
          '1000000': '0xB9BEbCeADdbed820EC663f83674D21A3Fc1e12dB'
        },
        symbol: 'ETN',
        decimals: 18
      }
    },
    pollInterval: 5,
    constants: {
      NOTE_ACCOUNT_BLOCK: 8838361,
      ENCRYPTED_NOTES_BLOCK: 8838361,
      GOVERNANCE_BLOCK: 8838348,
      RELAYER_REGISTRY_BLOCK: 8838355
    },
    'mishmash-router': '0xCB6aDc219DB1948412f11E4675463c07210F5C32',
    'governance.contract.mishmash.cash': '0xd5BCb45FBdC71Ff75C63f545567eDc5cc2721746',
    'mash.contract.mishmash.cash': '0x1b17a987eD0B5d62331841ca2C4cB6D9e1Dc385a'
  },
  netId5201420: {
    rpcCallRetryAttempt: 15,
    gasPrices: {
      instant: 80,
      fast: 50,
      standard: 25,
      low: 8
    },
    nativeCurrency: 'etn',
    currencyName: 'ETN',
    explorerUrl: {
      tx: 'https://testnet-blockexplorer.electroneum.com/tx/',
      address: 'https://testnet-blockexplorer.electroneum.com/address/',
      block: 'https://testnet-blockexplorer.electroneum.com/block/'
    },
    merkleTreeHeight: 20,
    emptyElement: '21663839004416932945382355908790599225266501822907911457504978515578255421292',
    networkName: 'Electroneum Testnet',
    deployedBlock: 8325913,
    rpcUrls: {
      Ankr: {
        name: 'Ankr',
        url: 'https://rpc.ankr.com/electroneum_testnet'
      }
    },
    scriptRpcUrls: {
      http: 'https://rpc.ankr.com/electroneum_testnet'
    },
    multicall: '0xA7f3d2dEa7a53E7A9FEbBdE5Cf7C69d39D065030',
    relayerRegistryContract: '0xa40f935977531D3b611999134a10Fb945ecfAAE7',
    instanceRegistryContract: '0x8151F8D0E35B1827e38d10E0E516Ae5d71B6CFd1',
    echoContractAccount: '0xB2b6D12B548716981e79b6066B7fB9881f3C36C5',
    aggregatorContract: '0x8b4d956a928d2D78f26f500e68254380aDC1a15F',
    ensSubdomainKey: 'testnet-mishmash',
    tokens: {
      etn: {
        instanceAddress: {
          '1': '0x2EE12a26A0b291a19EF811a48E076503e088208a',
          '10': '0xb3b770b5d6dC9F471a3B403FE3EAb9c34496AF2C',
          '100': '0xb8b811c0b136BfdFEfA975483C5d6aDDDfF7cc42',
          '0.1': '0x15d7781438DeFcc74a46D3Ed330382E6A91cFe19'
        },
        symbol: 'ETN',
        decimals: 18
      }
    },
    pollInterval: 5,
    constants: {
      NOTE_ACCOUNT_BLOCK: 8325914,
      ENCRYPTED_NOTES_BLOCK: 8325914,
      GOVERNANCE_BLOCK: 8325901,
      RELAYER_REGISTRY_BLOCK: 8325908
    },
    'mishmash-router': '0x0cBcE29CBf9511B1E5859dc4CDFf062C1905Aba6',
    'governance.contract.mishmash.cash': '0xC8e7F7a02328Ad9B80832B8bCE768cB08cF59Be5',
    'mash.contract.mishmash.cash': '0x2B22a75F6388383A93b0eF91D4255d4F5FC81d89'
  }
}
