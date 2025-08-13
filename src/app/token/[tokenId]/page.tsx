'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa6";
import { MdToken } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import FeinAddress from '@/contract_data/Fein-address.json';
import FeinAbi from '@/contract_data/Fein.json';
import { ethers } from 'ethers';
import { buyToken } from '@/lib/actions/token.actions'; // Import the server action
import { FaSpinner } from 'react-icons/fa';

interface PageProps {
  params: {
    tokenId: string;
  };
}

interface TokenData {
  user: any;
  tokenId: string;
  tokenName: string;
  tokenPrice: number;
  tokenDesc: string;
  availableToken: number;
  tokenThumbail: string;
}

const Page = ({ params }: PageProps) => {
  const tokenId = params.tokenId;
  console.log(tokenId);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tokensToBuy, setTokensToBuy] = useState(1);
  const [Fein, setFein] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractInstance5 = new ethers.Contract(
          FeinAddress.address,
          FeinAbi.abi,
          signer
        );
        setFein(contractInstance5);
      } else {
        alert('MetaMask not detected. Please install MetaMask.');
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(`/api/getMintedTokensById`,{tokenId:tokenId});
        console.log(res.data);
        setTokenData(res.data.mintedToken);
        if (res.data.mintedToken.availableToken === 0) {
          setIsSoldOut(true);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchData();
  }, [tokenId]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleBuyNowClick = async () => {
    setIsLoading(true);
    try {

      if (tokenData) {
        const { tokenId, tokenPrice } = tokenData;
        const finalTokenPrice = tokenPrice/10000;
        console.log("fdsafads",tokenId, finalTokenPrice);
        if (Fein) {
          const tx = await Fein.buyStake(tokenId, tokensToBuy, {
            value: ethers.utils.parseEther((tokensToBuy * finalTokenPrice).toString())
          });
          await tx.wait();

          // Call the server action to save the transaction details
          await buyToken({
            accountAddress: tokenData.user.accountAddress,
            tokenId: Number(tokenId),
            tokensBought: tokensToBuy,
          });
        }
      }
    } catch (error) {
      console.error('Error during transaction:', error);
      alert('Transaction failed. Please try again.');
    }
    setIsLoading(false);
    setIsDialogOpen(false);
  };

  const incrementTokens = () => {
    if (tokensToBuy < (tokenData?.availableToken ?? 0)) {
      setTokensToBuy(tokensToBuy + 1);
    }
  };

  const decrementTokens = () => {
    if (tokensToBuy > 1) {
      setTokensToBuy(tokensToBuy - 1);
    }
  };

  if (!tokenData) {
    return (
      <div className='bg-[#18181a] w-full min-h-screen text-[#5d5ece] flex items-center justify-center'>
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  return (
    <div className='w-full flex min-h-screen px-72 text-white bg-[#18181a] pt-12'>
      <div className='w-1/2 px-12'>
        <img src={`https://emerald-managerial-firefly-535.mypinata.cloud/ipfs/${tokenData.tokenThumbail}`} alt={tokenData.tokenName} className="w-full rounded-lg" />
        <div className='w-full flex mt-8'>
          <div className='w-1/2 h-24 rounded-lg bg-[#232328] gap-1 flex flex-col px-4 pt-2'>
            <p className='text-sm opacity-60'>creater_name</p>
            <p>{tokenData.user?.userInfo?.name !== undefined ? tokenData.user.userInfo.name : 'Artist'}</p>
            <Link className='flex items-center gap-2' href={`/portfolio/${tokenData.user.accountAddress}`}>
              <p className='text-blue-400'>{tokenData.user.accountAddress.substr(0, 8) + "..."}</p>
              <FaExternalLinkAlt className='text-blue-400 w-3' />
            </Link>
          </div>
        </div>
      </div>
      <div className='w-1/2 pt-6 flex flex-col'>
        <h1 className='text-3xl font-semibold'>{tokenData.tokenName}</h1>
        <p className='mt-4'> <span className='text-gray-400'> Artist </span><span className='text-blue-400 ml-2'>{tokenData.user.accountAddress.substr(0, 8) + "..."}</span></p>
        <p className='mt-2'>{tokenData.tokenDesc}</p>
        <div className='w-full flex mt-8 gap-6 '>
          <div className='w-1/2 px-4 py-4 rounded-lg bg-[#232328]'>
            <p className=' text-lg font-semibold'>Price</p>
            <div className='flex items-center pt-4'>
              <FaEthereum className='text-lg' />
              <p className='text-2xl ml-2'>{tokenData.tokenPrice/10000}</p>
            </div>
          </div>
          <div className='w-1/2 px-4 py-4 rounded-lg bg-[#232328]'>
            <p className=' text-lg font-semibold'>Available Tokens</p>
            <div className='flex items-center pt-4'>
              <MdToken className='text-lg' />
              <p className='text-2xl ml-2'>{tokenData.availableToken}</p>
            </div>
          </div>
        </div>
        {isSoldOut ? (
          <div className='w-1/2 text-center bg-red-600 py-4 mt-8 rounded-lg font-semibold'>
            Sold Out
          </div>
        ) : (
          <div className='w-1/2 text-center bg-[#5d5ece] py-4 mt-8 rounded-lg font-semibold cursor-pointer' onClick={handleOpenDialog}>
            Buy Now
          </div>
        )}
      </div>

      {isDialogOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-[#232328] p-8 rounded-lg text-white w-1/3 relative'>
            <IoClose className='absolute top-4 right-4 cursor-pointer' size={24} onClick={() => setIsDialogOpen(false)} />
            <h2 className='text-2xl font-semibold mb-4'>Buy Tokens</h2>
            <div className='mb-4 flex items-center justify-between'>
              <label className='block text-sm opacity-60 mb-2'>Number of Tokens</label>
              <div className='flex items-center'>
                <button className='bg-[#1a1a1d] text-white rounded-full w-8 h-8 flex items-center justify-center' onClick={decrementTokens}>-</button>
                <span className='mx-4'>{tokensToBuy}</span>
                <button className='bg-[#1a1a1d] text-white rounded-full w-8 h-8 flex items-center justify-center' onClick={incrementTokens}>+</button>
              </div>
            </div>
            <div className='mb-4'>
              <p className='text-lg'>Total Amount</p>
              <div className='flex items-center mt-2'>
                <FaEthereum className='text-lg' />
                <p className='text-2xl ml-2'>{tokensToBuy * tokenData.tokenPrice/10000}</p>
              </div>
            </div>
            <div className='flex justify-end'>
              <button className='bg-[#5d5ece] px-4 py-2 rounded-lg' onClick={handleBuyNowClick} disabled={isLoading}>
                {isLoading ? <FaSpinner className="animate-spin text-[#5d5ece]" /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>  
  );
};

export default Page;