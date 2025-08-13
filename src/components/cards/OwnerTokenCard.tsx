'use client';

import Image from "next/legacy/image";
import React, { useEffect, useState } from 'react';
import { MdToken } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import { MdDiamond } from "react-icons/md";
import FeinAddress from '@/contract_data/Fein-address.json';
import FeinAbi from '@/contract_data/Fein.json';
import { BigNumber, ethers } from "ethers"; // Import BigNumber
import { releaseSong } from "@/lib/actions/token.actions";

type Props = {
    imageUrl: string;
    tokenName: string;
    tokenPrice: number;
    tokenId: number;
    isReleased: boolean;
    availableToken: number;
};

const OwnerTokenCard = (props: Props) => {
    const [Fein, setFein] = useState<any>(null);
    const [isReleased, setIsReleased] = useState(props.isReleased);
    const [tokenId] = useState<BigNumber>(BigNumber.from(Number(props.tokenId))); // Parse tokenId to BigNumber

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

    const handleRelease = async () => {
        console.log('Release button clicked');
        if (Fein) {
            try {
                const tx = await Fein.releaseSong(tokenId);
                await tx.wait();
                console.log('Song released successfully');
                await releaseSong(Number(tokenId.toString())); // Convert BigNumber to number
                setIsReleased(true); // Update local state
            } catch (error) {
                console.error('Error releasing song:', error);
            }
        } else {
            console.error('Fein contract instance not initialized');
        }
    }

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
            {isReleased ? <button className="w-full text-center py-2 bg-green-700 font-semibold text-lg">
                Released
            </button> : <button className="w-full text-center py-2 bg-[#5b5bd5] font-semibold text-lg cursor-pointer" onClick={handleRelease}>
                Release
            </button>
            }
        </div>
    );
};

export default OwnerTokenCard;