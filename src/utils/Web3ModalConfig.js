import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { ethers } from 'ethers';

// 1. Your WalletConnect Cloud project ID
const projectId = '1d355069af77c77b83818ef41bb8bdb7';

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
};

// 3. Create a metadata object
const metadata = {
  name: 'Hexalink',
  description: 'AppKit Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: 'https://cloudflare-eth.com',
  defaultChainId: 1,
});

// 5. Create a Web3Modal instance
const web3Modal = createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true
});

export default web3Modal;
