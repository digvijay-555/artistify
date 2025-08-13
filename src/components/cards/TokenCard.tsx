'use client';

import Image from "next/legacy/image";
import React from 'react';
import { MdToken } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import { MdDiamond } from "react-icons/md";
import Link from "next/link";

type Props = {
    imageUrl: string;
    tokenName: string;
    tokenPrice: number;
    tokenId: number;
    availableToken: number;
};

const TokenCard = (props: Props) => {
    return (
        <Link href={`/token/${props.tokenId}`}>
        <div className="w-80 h-[450px] rounded-xl flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group cursor-pointer">
            <div className="relative w-full h-1/2 flex-1">
                <Image
                    src={props.imageUrl}
                    layout="fill"
                    style={{ objectFit: 'cover' }}
                    alt="token"
                    className="rounded-t-xl"
                />
            </div>
            <div className="w-full p-4 flex flex-col justify-start bg-[#232328] pb-16">
                <div className='px-1 flex justify-between items-center'>
                    <h1 className="text-md font-bold text-white">{props.tokenName}</h1>
                    <div className="flex gap-2 items-center text-lg">
                        <MdToken className='text-white' />
                        <p className="text-white">{props.availableToken}</p>
                    </div>
                </div>
                <div className='px-2 flex justify-between items-center'>
                    <div className="flex gap-2 items-center text-lg">
                        <FaEthereum className='text-white' />
                        <p className="text-white">{props.tokenPrice/10000}</p>
                    </div>
                    <MdDiamond className='text-white' />
                </div>
            </div>
            
                <div className="w-full text-center rounded-b-xl py-2 text-white bg-[#5b5bd5] font-semibold text-lg absolute bottom-[-100%] left-0 group-hover:bottom-0 transition-all duration-300 ease-in-out">
                    Buy now
                </div>
        </div>
        </Link>
    );
};

export default TokenCard;