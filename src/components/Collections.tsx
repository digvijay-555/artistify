'use client'

import TokenCard from '@/components/cards/TokenCard';
import React, { useEffect, useState } from 'react';

const Collections = () => {
  interface Token {
    id: string;
    tokenThumbail: string;
    tokenName: string;
    availableToken: number;
    tokenId:number;
    tokenPrice: number;
  }

  const [tokens, setTokens] = useState<Token[]>([]);
  console.log(tokens)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('/api/getMintedTokens',{cache: "no-store"});
        const data = await response.json();
        console.log(data)
        setTokens(data.mintedTokens);
      } catch (error) {
        console.error('Error fetching minted tokens:', error);
      }
    };

    fetchTokens();
  }, []);

  return (
    <div className='w-full min-h-screen pt-8 px-10 bg-[#18181a] '>
      <div className='w-full mb-16 pt-3 px-6'>
        <h1 className='text-3xl font-medium'>Trending Tokens</h1>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
        {tokens.map((token) => (
          <TokenCard
            key={token.id}
            imageUrl={`https://emerald-managerial-firefly-535.mypinata.cloud/ipfs/${token.tokenThumbail}`}
            tokenName={token.tokenName}
            availableToken={token.availableToken}
            tokenPrice={token.tokenPrice}
            tokenId={token.tokenId}
          />
        ))}
      </div>
    </div>
  );
};

export default Collections;