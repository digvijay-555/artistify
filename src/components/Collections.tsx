'use client'

import TokenCard from '@/components/cards/TokenCard';
import React, { useEffect, useState, useCallback, useMemo } from 'react';

const Collections = () => {
  interface Token {
    id: string;
    tokenThumbail: string;
    tokenName: string;
    availableToken: number;
    tokenId: number;
    tokenPrice: number;
  }

  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/getMintedTokens', {
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tokens: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTokens(data.mintedTokens || []);
    } catch (error) {
      console.error('Error fetching minted tokens:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch tokens');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const memoizedTokens = useMemo(() => 
    tokens.map((token) => (
      <TokenCard
        key={token.id}
        imageUrl={`https://emerald-managerial-firefly-535.mypinata.cloud/ipfs/${token.tokenThumbail}`}
        tokenName={token.tokenName}
        availableToken={token.availableToken}
        tokenPrice={token.tokenPrice}
        tokenId={token.tokenId}
      />
    )), 
    [tokens]
  );

  if (loading) {
    return (
      <div className='w-full min-h-screen pt-8 px-10 bg-[#18181a] flex items-center justify-center'>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b5bd5]"></div>
          <p className="text-white text-lg">Loading tokens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full min-h-screen pt-8 px-10 bg-[#18181a] flex items-center justify-center'>
        <div className="flex flex-col items-center space-y-4">
          <p className="text-red-400 text-lg">Error: {error}</p>
          <button 
            onClick={fetchTokens}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-[#0a0a0a]'>
      <div className='max-w-7xl mx-auto px-6 pt-8'>
        <div className='w-full mb-16 pt-3'>
          <h1 className='text-3xl font-medium text-white'>Trending Tokens</h1>
          <p className='text-gray-400 mt-2'>{tokens.length} tokens available</p>
        </div>
        
        {tokens.length === 0 ? (
          <div className='flex items-center justify-center pt-20'>
            <p className='text-gray-400 text-lg'>No tokens available at the moment</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {memoizedTokens}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Collections);