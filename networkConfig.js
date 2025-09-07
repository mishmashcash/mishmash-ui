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
      http: 'http://localhost:8545'
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
          '1000': '0xcc69fdD4c06f1a580BfE219a3a369Db41AB617cB',
          '10000': '0x2727F56ab6d0c23dbd4b26bD5B4749cc35251141',
          '100000': '0x7bBfc6F25138F7903B414eD31A12eD2F78107aeD',
          '1000000': '0x6166CdEDd16cb1D31F4f4f8Da05Ab534D3e667Da'
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
    'mishmash-router': '0x77cfe4d6cD06C76584145B43Ca249Af6C37DBA2F',
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
      http: 'http://localhost:8548'
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
          '1': '0xb077305b36B0AA0ae04d6F16FE5d2792b84A8C99',
          '10': '0xb077305b36B0AA0ae04d6F16FE5d2792b84A8C99',
          '100': '0x9a0f9230254Dfd962825353A91aAEa4b794f6295',
          '0.1': '0x928ebD78DE9a163A11AC245Bc94e5Ed4a393AC72'
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
    'mishmash-router': '0x4c1574110E554f3199535ea22635f6A1452e9F64',
    'governance.contract.mishmash.cash': '0xC8e7F7a02328Ad9B80832B8bCE768cB08cF59Be5',
    'mash.contract.mishmash.cash': '0x2B22a75F6388383A93b0eF91D4255d4F5FC81d89'
  }
}
