'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const GoToPortfolio = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });

          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            console.log('Wallet address:', accounts[0]);
          } else {
            // alert('Please connect to MetaMask');
          }
        } catch (error) {
          console.error('Error fetching wallet address:', error);
          // alert('Failed to retrieve wallet address.');
        }
      } else {
        // alert('Please install MetaMask.');
      }
    };

    fetchWalletAddress();
  }, []);

  const handlePortfolioRedirect = () => {
    if (walletAddress) {
      router.push(`/portfolio/${walletAddress}`);
    }
  };

  return (
    <div>
      {walletAddress ? (
        <div className='w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% cursor-pointer' onClick={handlePortfolioRedirect}></div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GoToPortfolio;
