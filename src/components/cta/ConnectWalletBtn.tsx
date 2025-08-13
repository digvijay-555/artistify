'use client';

import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import axios from 'axios';
import { useState, useEffect, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FaSpinner } from 'react-icons/fa';
import { logInUser } from '@/lib/actions/user.actions';
const ConnectWalletButton = () => {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const response = await axios.post('/api/verifyToken', { token }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            const { userDetails } = response.data;
            setWalletConnected(true);
            setAddress(userDetails.accountAddress);
            console.log('Token verified, user details:', userDetails);
          } else {
            console.error('Failed to verify token');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletConnected(true);
      setAddress(address);
      console.log('Connected with address:', address);

      await logInUser(address.toLowerCase());
      try {
        // Call API to generate JWT
        const response = await axios.post('/api/generateToken', { address }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const { token } = response.data;
          localStorage.setItem('userToken', token);
          console.log('Token:', token);

          // Redirect to the same page to refresh the state
          router.refresh();
        } else {
          console.error('Failed to generate token');
        }
      } catch (error) {
        console.error('Error generating token:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setAddress(null);
    localStorage.removeItem('userToken');
    console.log('Disconnected from wallet');
    router.refresh();
  };

  return (
    walletConnected ? (
      <div className="flex items-center space-x-4">
        <button className="relative bg-[#5b5bd5] text-white px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg border-2 border-transparent hover:border-gradient-to-r from-green-400 to-green-600 transition duration-300">
          <span className="relative flex items-center space-x-2">
            <FontAwesomeIcon icon={faWallet} />
            <span>{address?.substr(0, 6) + "..." + address?.substr(address.length - 4, address.length - 1)}</span>
          </span>
        </button>
        <button onClick={disconnectWallet} className="relative bg-[#5b5bd5] text-white px-4 py-3 rounded-xl flex items-center shadow-lg border-2 border-transparent hover:border-gradient-to-r from-red-400 to-red-600 transition duration-300">
          <span className="relative flex items-center">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </span>
        </button>
      </div>
    ) : (
      <button onClick={connectWallet} className="relative text-white px-4 py-3 rounded-xl flex items-center space-x-2 shadow-lg border-2 border-transparent hover:border-gradient-to-r from-blue-400 to-blue-600 transition duration-300">
        {loading ? (
          <FaSpinner className="animate-spin text-[#5b5bd5]" />
        ) : (
          <>
            <FontAwesomeIcon icon={faWallet} />
            <span>Connect Wallet</span>
          </>
        )}
      </button>
    )
  );
};

export default memo(ConnectWalletButton);