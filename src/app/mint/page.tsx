'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import pinata from '@/lib/ipfs';
import axios from 'axios';
import { mintToken } from '@/lib/actions/token.actions';
import FeinAddress from '@/contract_data/Fein-address.json';
import FeinAbi from '@/contract_data/Fein.json';
import { ethers, Event } from 'ethers';
import { FaSpinner } from 'react-icons/fa';

export interface MintTokenData {
  tokenName: string;
  tokenDesc: string;
  tokenPrice: number;
  tokensToMint: number;
  percentShare: number;
  image: string;
  userAddress: string;
  tokenId: number;
}

const MintPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileCID, setFileCID] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [Fein, setFein] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserAddress = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const response = await axios.post('/api/verifyToken', { token }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            setAddress(response.data.userDetails.accountAddress);
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

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // Upload the selected file to IPFS
  const uploadFile = async () => {
    try {
      if (!selectedFile) {
        alert('Please select a file.');
        return;
      }

      setLoading(true);

      // Create FormData and append the selected file
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Upload the file to IPFS using Pinata
      const uploadResponse = await pinata.upload.file(formData);
      console.log('File CID:', uploadResponse.IpfsHash);

      // Set the uploaded file CID
      setFileCID(uploadResponse.IpfsHash);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    try {
      const { tokenName, tokenDesc, tokenPrice, tokensToMint, percentageShare } = data;

      if (!fileCID) {
        alert('Please upload an image.');
        return;
      }

      if (Fein) {
        try {
          const totalTosend = tokenPrice * tokensToMint;
          const tx = await Fein.mintNFT(tokensToMint, ethers.utils.parseEther(totalTosend.toString()), percentageShare);
          const receipt = await tx.wait();
          const event = await receipt.events.find((event: Event) => event.event === 'NFTMinted');
          console.log("receipt", receipt);
          const tId = await event.args[0].toNumber();
          console.log('Token ID:', tId);
          const mintedToken = await mintToken({
            tokenName,
            tokenDesc,
            tokenPrice: Math.round(parseFloat(tokenPrice) * 10000), // Convert to integer
            tokensToMint: parseInt(tokensToMint, 10),
            percentShare: parseInt(percentageShare, 10),
            tokenId: tId,
            image: fileCID,
            userAddress: address || '',
          });

          console.log(mintedToken)

          alert('Token minted successfully!');
          reset();
        } catch (error) {
          console.error('Error listing song:', error);
        }
      }
    } catch (error) {
      console.error('Error minting token:', error);
      alert('Error minting token');
    }
  };

  return (
    <div className="min-h-screen bg-[#18181a] flex justify-center items-center p-6">
      <div className="flex w-full max-w-6xl shadow-md rounded-lg px-6 py-10 mb-24">
        <div className="w-1/2 flex flex-col items-center justify-center border border-gray-700 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-4">Upload Image</h1>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-white rounded-md shadow-sm p-2 mb-4 pl-36"
          />
          <button
            type="button"
            onClick={uploadFile}
            className="bg-[#5b5bd5] text-white px-4 py-2 rounded-xl"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Upload Image'}
          </button>
          {fileCID && (
            <div className="mt-4">
              <h2 className="text-xl font-bold text-white">Uploaded Image</h2>
              <img src={`https://ipfs.infura.io/ipfs/${fileCID}`} alt="Token" className="mt-2 rounded-lg" />
            </div>
          )}
        </div>
        <div className="w-1/2 pl-6">
          <h1 className="text-3xl font-bold text-white mb-4">Mint Token</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Token Name</label>
              <input
                type="text"
                {...register('tokenName', { required: true })}
                className="mt-1 block w-full border bg-[#232328] border-gray-600 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Token Description</label>
              <textarea
                {...register('tokenDesc', { required: true })}
                className="mt-1 block w-full border bg-[#232328] border-gray-600 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-white">Token Price</label>
                <input
                  type="number"
                  step="0.0001"
                  {...register('tokenPrice', { required: true })}
                  className="mt-1 block w-full border bg-[#232328] border-gray-600 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-white">Tokens to Mint</label>
                <input
                  type="number"
                  {...register('tokensToMint', { required: true })}
                  className="mt-1 block w-full border bg-[#232328] border-gray-600 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Percentage Share</label>
              <input
                type="number"
                {...register('percentageShare', { required: true })}
                className="mt-1 block w-full text-black border bg-[#232328]  border-gray-600 rounded-md shadow-sm p-2"
              />
            </div>
            <button
              type="submit"
              className="bg-[#5b5bd5] text-white px-4 py-2 rounded-xl"
            >
              Mint Token
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MintPage;