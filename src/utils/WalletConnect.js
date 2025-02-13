import React, { useState } from 'react';
import web3Modal from './Web3ModalConfig';// Import your Web3Modal instance
import { ethers } from 'ethers';

const ConnectButton = () => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    try {
      const instance = await web3Modal.openModal();
      const ethersProvider = new ethers.providers.Web3Provider(instance.provider);
      const accounts = await ethersProvider.listAccounts();
      setProvider(ethersProvider);
      setAddress(accounts[0]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>
        Connect Wallet
      </button>
      {address && <p>Connected Address: {address}</p>}
    </div>
  );
};

export default ConnectButton;
