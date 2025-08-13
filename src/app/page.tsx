'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { FaEthereum } from 'react-icons/fa';
import Link from 'next/link';

interface Token {
  id: string;
  tokenThumbail: string;
  tokenName: string;
  availableToken: number;
  tokenPrice: number;
  createdAt: string;
  user: {
    userInfo: {
      name: string;
      profilePicture: string; // Assuming there's a profile picture URL
    };
  };
}

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get('/api/getMintedTokens');
        setTokens(response.data.mintedTokens);
      } catch (error) {
        console.error('Error fetching minted tokens:', error);
      }
    };

    fetchTokens();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#18181a] overflow-y-hidden text-white">
      <div className="w-full h-1/2 flex flex-col px-20 mt-8">
        <h1 className="text-2xl font-semibold">Featured</h1>
        <div className="w-full mt-8 px-4 flex items-center gap-8">
          <img src="https://emerald-managerial-firefly-535.mypinata.cloud/ipfs/QmdnWJbbNzpMREVQR235RFmnYt4oKhwHKf98CQKYzzSxe9" alt="Featured Token" className="w-80 h-72 rounded-lg object-cover" />
          <div className="flex flex-col justify-between h-72">
            <div>
              <h2 className="text-xl font-semibold">Featured</h2>
              <p className="text-gray-400 mt-2 w-60">
                Discover the unique features of our featured token, a digital asset that combines rarity and value. This token offers exclusive benefits to its holders, including access to special events, early product releases, and more. Join the community of elite collectors and investors who recognize the potential of this exceptional token.
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Link href="collection">
              
                <button className="bg-[#5b5bd5] text-white px-4 py-2 rounded-lg">View Details</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1/2 flex flex-col px-20 mt-8">
        <h1 className="text-2xl font-semibold">Trending</h1>
        <div className="w-full flex items-center mt-6 gap-6 text-lg cursor-pointer">
          <p className="border-[#5b5bd5] border-b-4">Collections</p>
          <p className="pb-2">Mints</p>
        </div>
        <div className="w-full mt-8 px-8">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#27282d] text-gray-400">
                <th className="p-4 border-b border-gray-600">Token</th>
                <th className="p-4 border-b border-gray-600 text-center">Available Tokens</th>
                <th className="p-4 border-b border-gray-600 text-center">Token Price</th>
                <th className="p-4 border-b border-gray-600 text-center">Owner</th>
                <th className="p-4 border-b border-gray-600 text-center">Created</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.id} className="hover:bg-[#232328] h-16">
                  <td className="p-4 border-b border-gray-700 flex items-center gap-4">
                    <img src={`https://emerald-managerial-firefly-535.mypinata.cloud/ipfs/${token.tokenThumbail}`} alt={token.tokenName} className="w-16 h-16 rounded-lg" />
                    <span>{token.tokenName}</span>
                  </td>
                  <td className="p-4 border-b border-gray-600 text-center">{token.availableToken}</td>
                  <td className="p-4 border-b border-gray-600 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <FaEthereum />
                      {token.tokenPrice / 10000} ETH
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-600 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                      {token.user?.userInfo?.name !== undefined ? token.user.userInfo.name : 'Artist'}
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-600 text-center">{formatDistanceToNow(new Date(token.createdAt))} ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}