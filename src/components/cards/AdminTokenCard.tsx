'use client';

import Image from "next/legacy/image";
import React, { useEffect, useState } from 'react';
import { MdToken } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import { MdDiamond } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import FeinAddress from '@/contract_data/Fein-address.json';
import FeinAbi from '@/contract_data/Fein.json';
import { BigNumber, ethers } from "ethers"; // Import BigNumber

type Props = {
    imageUrl: string;
    tokenName: string;
    tokenPrice: number;
    tokenId: number;
    isReleased: boolean;
    availableToken: number;
};

const AdminTokenCard = (props: Props) => {
    const [Fein, setFein] = useState<any>(null);
    const [tokenId] = useState<BigNumber>(BigNumber.from(Number(props.tokenId))); // Parse tokenId to BigNumber
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        console.log('tokenID', tokenId.toString()); // Log tokenId as string
    }, [tokenId]);

    const handleTokenSales = async() => {
        if (Fein) {
            try {
              const tx = await Fein.artistTokenSales(tokenId);
              await tx.wait();
              console.log('Artist token sales completed');
            } catch (error) {
              console.error('Error in artistTokenSales:', error);
            }
          }
    }

    const handleRevenue = async () => {
        console.log('Release button clicked');
        const randomNumber = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const revenue = ethers.utils.parseEther((randomNumber(1000, 10000) / 100000).toString());
        console.log('Revenue:', revenue.toString());
        // Generate random revenue
        if (Fein) {
            try {
              const tx = await Fein.addRevenueGen(tokenId, { value: revenue });
              await tx.wait();
              console.log('Revenue added successfully');
            } catch (error) {
              console.error('Error adding revenue:', error);
            }
        }
        else {
            console.error('Fein contract instance not initialized');
        }
    }

    const handleDistribute = async () => {
        if (Fein) {
            try {
              const tx = await Fein.distributeRevenue(tokenId);
              await tx.wait();
              console.log('Revenue distributed successfully');
            } catch (error) {
              console.error('Error distributing revenue:', error);
            }
          }
    }

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className="w-80 h-[450px] rounded-lg flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
            <div className="relative w-full h-1/2 flex-1">
                <Image
                    src={props.imageUrl}
                    layout="fill"
                    style={{ objectFit: 'cover' }}
                    alt="token"
                    className="rounded-t-xl"
                />
            </div>
            <div className="w-full p-4 flex flex-col justify-start bg-[#232328]">
                <div className='px-1 flex justify-between items-center'>
                    <h1 className="text-md font-bold">{props.tokenName}</h1>
                    <div className="flex gap-2 items-center text-lg">
                        <MdToken className='text-white' />
                        <p>{props.availableToken}</p>
                    </div>
                </div>
                <div className='px-2 flex justify-between items-center'>
                    <div className="flex gap-2 items-center text-lg">
                        <FaEthereum className='text-white' />
                        <p>{props.tokenPrice / 10000}</p>
                    </div>
                    <MdDiamond className='text-white' />
                </div>
            </div>
            <div className="w-full flex">
                <button className="w-full text-center py-2 bg-[#5b5bd5] font-semibold text-lg cursor-pointer" onClick={handleOpenDialog}>
                    Details
                </button>
            </div>

            {isDialogOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-[#232328] p-8 rounded-lg text-white w-1/3 relative'>
                        <IoClose className='absolute top-4 right-4 cursor-pointer' size={24} onClick={handleCloseDialog} />
                        <h2 className='text-2xl font-semibold mb-4'>Token Details</h2>
                        <div className='mb-4'>
                            <h3 className='text-lg font-semibold'>Step 1: Artist Token Sales</h3>
                            <button className='bg-[#5b5bd5] text-white px-4 py-2 rounded-lg mt-2' onClick={handleTokenSales}>
                                Complete Token Sales
                            </button>
                        </div>
                        <div className='mb-4'>
                            <h3 className='text-lg font-semibold'>Step 2: Release Revenue</h3>
                            <button className='bg-[#5b5bd5] text-white px-4 py-2 rounded-lg mt-2' onClick={handleRevenue}>
                                Release Revenue
                            </button>
                        </div>
                        <div className='mb-4'>
                            <h3 className='text-lg font-semibold'>Step 3: Distribute Revenue</h3>
                            <button className='bg-[#5b5bd5] text-white px-4 py-2 rounded-lg mt-2' onClick={handleDistribute}>
                                Distribute Revenue
                            </button>
                        </div>
                        <div className='flex justify-end'>
                            <button className='bg-[#5b5bd5] px-4 py-2 rounded-lg' onClick={handleCloseDialog}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTokenCard;