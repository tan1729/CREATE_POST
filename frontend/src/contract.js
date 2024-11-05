import { ethers } from 'ethers';
import abi from './abi.json';

const contractAddress = '0x022414c23f3b5610d6126daae789728203948605'; 

const getContract = async () => {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []); // Request account access
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        return contract;
    } catch (error) {
        console.error('Error initializing contract:', error);
        throw error;
    }
};

export default getContract;


