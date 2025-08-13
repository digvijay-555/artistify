'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import OwnerTokenCard from '../cards/OwnerTokenCard';

const TokenSection = () => {
  const [activeTab, setActiveTab] = useState('Minted Tokens');
  interface UserData {
    accountAddress: string;
    mintedTokens: {
      id: string;
      tokenThumbail: string;
      tokenName: string;
      availableToken: number;
      tokenPrice: number;
      isReleased: boolean;
      tokenId: string;
    }[];
  }

  const [userData, setUserData] = useState<UserData | null>(null);  // Initialize with null or empty object

  useEffect(() => {
    const fetchUserAddress = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const response = await fetch('/api/verifyToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const data = await response.json();
            setUserData(data.userDetails);
          } else {
            console.error('Failed to verify token');
          }
        } catch (error) {
          console.error('Error fetching user address:', error);
        }
      }
    };

    fetchUserAddress();
  }, []);

  // useEffect to log userData after it's updated
  useEffect(() => {
    if (userData) {
      console.log('User data:', userData);  // Log only after userData is updated
    }
  }, [userData]);  // Depend on userData, so it runs when userData changes

  const renderContent = () => {
    switch (activeTab) {
      case 'Items':
        return <div className='w-full flex justify-center pt-44'>
          <p className='text-gray-500 text-lg'>No Items Available</p>
        </div>;
      case 'Minted Tokens':
        return (
          <div className='w-full mt-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
              {userData?.mintedTokens.map((token) => (
                <OwnerTokenCard
                  key={token.id}
                  imageUrl={`https://emerald-managerial-firefly-535.mypinata.cloud/ipfs/${token.tokenThumbail}`}
                  tokenName={token.tokenName}
                  availableToken={token.availableToken}
                  tokenPrice={token.tokenPrice}
                  isReleased={token.isReleased}
                  tokenId={Number(token.tokenId)}
                />
              ))}
            </div>
            <Link href={`/mint?address=${userData?.accountAddress}`}>
              <button className='bg-[#5b5bd5] text-white px-4 py-2 rounded-xl mt-4'>Mint Token</button>
            </Link>
          </div>
        );
      case 'Holdings':
        return <div className='w-full flex justify-center pt-44'>
          <p className='text-gray-500 text-lg'>No Holdings Available</p>
      </div>;
      case 'Activity':
        return <div className='w-full flex justify-center pt-44'>
          <p className='text-gray-500 text-lg'>No Recent Activity</p>
      </div>;
      default:
        return null;
    }
  };

  return (
    <div className='px-24 py-6 min-h-screen bg-[#18181a]'>
      <div className='flex items-center gap-12'>
        {['Items', 'Minted Tokens', 'Holdings', 'Activity'].map(tab => (
          <p
            key={tab}
            className={`cursor-pointer pb-2 ${activeTab === tab ? 'text-[#5b5bd5] border-b-2 border-[#5b5bd5]' : 'text-white'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </p>
        ))}
      </div>
      <div className='mt-4 p-4 border-t border-gray-700'>
        {renderContent()}
      </div>
    </div>
  );
}

export default TokenSection;
