export interface ChainIdModel {
  1: string;
  3: string;
  42: string;
  4: string;
  5: string;
  56: string;
  97: string;
  100: string;
  43114: string;
  137: string;
  361: string;
  365: string;
  1285: string;
  80001: string;
  1666600000: string;
  11297108109: string;
  1337: string;
  31337: string;
  250: string;
}

export enum ChainId {
  Ethereum = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  BSC = 56,
  BSCTestnet = 97,
  xDai = 100,
  Polygon = 137,
  Theta = 361,
  ThetaTestnet = 365,
  Moonriver = 1285,
  Avalanche = 43114,
  Mumbai = 80001,
  Harmony = 1666600000,
  Palm = 11297108109,
  Localhost = 1337,
  Hardhat = 31337,
  Fantom = 250,
}

export const CHAIN_NAMES: ChainIdModel = {
  [ChainId.Ethereum]: 'Ethereum',
  [ChainId.Ropsten]: 'Ropsten',
  [ChainId.Kovan]: 'Kovan',
  [ChainId.Rinkeby]: 'Rinkeby',
  [ChainId.Goerli]: 'Goerli',
  [ChainId.BSC]: 'BSC',
  [ChainId.BSCTestnet]: 'BSCTestnet',
  [ChainId.xDai]: 'xDai',
  [ChainId.Avalanche]: 'Avalanche',
  [ChainId.Polygon]: 'Polygon',
  [ChainId.Theta]: 'Theta',
  [ChainId.ThetaTestnet]: 'ThetaTestnet',
  [ChainId.Moonriver]: 'Moonriver',
  [ChainId.Mumbai]: 'Mumbai',
  [ChainId.Harmony]: 'Harmony',
  [ChainId.Palm]: 'Palm',
  [ChainId.Localhost]: 'Localhost',
  [ChainId.Hardhat]: 'Hardhat',
  [ChainId.Fantom]: 'Fantom',
}

export const NETWORK_ICON: ChainIdModel = {
  [ChainId.Ethereum]: '/assets/icons/networks/mainnet.jpeg',
  [ChainId.Ropsten]: '/assets/icons/networks/ropsten.jpeg',
  [ChainId.Kovan]: '/assets/icons/networks/fantom.jpeg',
  [ChainId.Rinkeby]: '/assets/icons/networks/rinkeby.jpeg',
  [ChainId.Goerli]: '/assets/icons/networks/fantom.jpeg',
  [ChainId.BSC]: 'assets/icons/networks/bsc.jpeg',
  [ChainId.BSCTestnet]: '/assets/icons/networks/bsc.jpeg',
  [ChainId.xDai]: '/assets/icons/networks/xdai.jpeg',
  [ChainId.Avalanche]: '/assets/icons/networks/avalanche.jpeg',
  [ChainId.Polygon]: '/assets/icons/networks/polygon.jpeg',
  [ChainId.Theta]: '',
  [ChainId.ThetaTestnet]: '',
  [ChainId.Moonriver]: '/assets/icons/networks/moonriver.jpeg',
  [ChainId.Harmony]: '/assets/icons/networks/fantom.jpeg',
  [ChainId.Mumbai]: '',
  [ChainId.Palm]: '/assets/icons/networks/palm.jpeg',
  [ChainId.Localhost]: '',
  [ChainId.Hardhat]: '',
  [ChainId.Fantom]: '/assets/icons/networks/fantom.jpeg',
}

export const  NETWORK_INFO = {
  [ChainId.Ethereum]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  [ChainId.Ropsten]: {
    chainId: '0x3',
    chainName: 'Ropsten',
    nativeCurrency: {
      name: 'Ropsten',
      symbol: 'ROP',
      decimals: 18,
    },
    rpcUrls: ['https://ropsten.infura.io/v3'],
    blockExplorerUrls: ['https://ropsten.etherscan.io']
  },
  [ChainId.Rinkeby]: {
    chainId: '0x4',
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'Rinkeby',
      symbol: 'RIN',
      decimals: 18,
    },
    rpcUrls: ['https://rinkeby.infura.io/v3'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io']
  },
  [ChainId.Goerli]: {
    chainId: '0x5',
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'Goerli',
      symbol: 'GOR',
      decimals: 18,
    },
    rpcUrls: ['https://goerli.infura.io/v3'],
    blockExplorerUrls: ['https://goerli.etherscan.io']
  },
  [ChainId.Kovan]: {
    chainId: '0x2a',
    chainName: 'Kovan',
    nativeCurrency: {
      name: 'Kovan',
      symbol: 'KOV',
      decimals: 18,
    },
    rpcUrls: ['https://kovan.infura.io/v3'],
    blockExplorerUrls: ['https://kovan.etherscan.io']
  },
  [ChainId.Fantom]: {
    chainId: '0xfa',
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: ['https://rpcapi.fantom.network/'],
    blockExplorerUrls: ['https://ftmscan.com/Premi']
  },
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'BSC',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  [ChainId.BSCTestnet]: {
    chainId: '0x61',
    chainName: 'BSCTestnet',
    nativeCurrency: {
      name: 'Smart Chain - Testnet',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com']
  },
  [ChainId.Polygon]: {
    chainId: '0x89',
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com/']
  },
  [ChainId.xDai]: {
    chainId: '0x64',
    chainName: 'xDai',
    nativeCurrency: {
      name: 'xDai',
      symbol: 'xDai',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.xdaichain.com/'],
    blockExplorerUrls: ['https://blockscout.com/poa/xdai']
  },
  [ChainId.Avalanche]: {
    chainId: '0xa86a',
    chainName: 'Avalanche',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io']
  },
  [ChainId.Harmony]: {
    chainId: '0xa4ec',
    chainName: 'Harmony',
    nativeCurrency: {
      name: 'Harmony',
      symbol: 'ONE',
      decimals: 18,
    },
    rpcUrls: ['https://api.harmony.one'],
    blockExplorerUrls: ['explorer.harmony.one']
  },
  [ChainId.Palm]: {
    chainId: '0x2a15c308d',
    chainName: 'Palm',
    nativeCurrency: {
      name: 'Palm',
      symbol: 'PALM',
      decimals: 18,
    },
    rpcUrls: ['https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b'],
    blockExplorerUrls: ['https://explorer.palm.io/']
  },
  [ChainId.Moonriver]: {
    chainId: '0x505',
    chainName: 'Moonriver',
    nativeCurrency: {
      name: 'Moonriver',
      symbol: 'MOVR',
      decimals: 18,
    },
    rpcUrls: ['https://moonriver.public.blastapi.io'],
    blockExplorerUrls: ['https://blockscout.moonriver.moonbeam.network/']
  },
  [ChainId.Hardhat]: {
    chainId: '0x7a69',
    chainName: 'Hardhat',
    nativeCurrency: {
      name: 'Hardhat',
      symbol: 'HETH',
      decimals: 18,
    },
    rpcUrls: ['http://127.0.0.1:8545/'],
    blockExplorerUrls: ['http://127.0.0.1:8545/']
  },
}
