'use client'

import Link from 'next/link';
import React, { useEffect } from 'react';
import ConnectWalletButton from '@/components/cta/ConnectWalletBtn';
import { MdDiamond } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';
// import FeinAddress from '@/contract_data/Fein-address.json';
// import FeinAbi from '@/contract_data/Fein.json';
import { ethers } from 'ethers';
import GoToPortfolio from '../cta/GoToPortfolio';

const Navbar = () => {
  // const [Fein, setFein] = useState<any>(null);
  // const [adminAddress, setAdminAddress] = useState<string | null>(null);
  // const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log('curr address', address);
        // setCurrentAddress(address);

        // const contractInstance5 = new ethers.Contract(
        //   FeinAddress.address,
        //   FeinAbi.abi,
        //   signer
        // );
        // setFein(contractInstance5);
      } else {
        alert('MetaMask not detected. Please install MetaMask.');
      }
    };

    init();
  }, []);

  // useEffect(() => {
  //   const getOwner = async () => {
  //     if (Fein) {
  //       try {
  //         const res = await Fein.getContractOwner();
  //         console.log(res)
  //         setAdminAddress(res);
  //       } catch (error) {
  //         console.error('Error fetching contract owner:', error);
  //       }
  //     }
  //   };
  //   getOwner();
  // }, [Fein]);

  return (
    <div className="w-full h-[87px] border-b-[1px] border-gray-600 flex items-center px-16 bg-[#18181a] gap-44">
      <div className="flex items-center gap-20 text-lg font-semibold text-white">
        {/* Left elements */}
        <Link href="/">
          <MdDiamond className="w-8 h-auto cursor-pointer" />
        </Link>
        <Link href="/collection" className="relative transition duration-300">
          <div className="hover:border-b-2 border-gray-400 pb-1">Collections</div>
        </Link>
        <Link href="/listen" className="relative transition duration-300">
          <div className="hover:border-b-2 border-gray-400 pb-1">Listen</div>
        </Link>
      </div>
      <div className="flex-grow flex justify-center">
        {/* Center input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search..."
            className="px-12 py-3 rounded-lg w-full bg-[#27282d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {/* Right elements */}
        <ConnectWalletButton />
        {/* {currentAddress === adminAddress && (
          <Link href="/admin">
            <button className="bg-[#5b5bd5] text-white px-4 py-2 rounded-xl shadow-lg border-2 border-transparent hover:border-gradient-to-r from-green-400 to-green-600 transition duration-300">
              Admin Page
            </button>
          </Link>
        )} */}
        <GoToPortfolio />
      </div>
    </div>
  );
};

export default Navbar;