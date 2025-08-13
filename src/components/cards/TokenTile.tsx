'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import Link from 'next/link';

interface TokenTileProps {
  id: string;
  tokenThumbail: string;
  tokenName: string;
  availableToken: number;
  tokenPrice: number;
  createdAt: string;
  user?: {
    userInfo?: {
      name: string;
      profilePicture?: string;
    };
  };
  tokenId?: number;
}

const TokenTile: React.FC<TokenTileProps> = ({
  id,
  tokenThumbail,
  tokenName,
  availableToken,
  tokenPrice,
  createdAt,
  user,
  tokenId
}) => {
  return (
    <Link href={tokenId ? `/token/${tokenId}` : `/collection`}>
      <div className="group cursor-pointer">
        <div className="flex items-center gap-4 p-4 hover:bg-[#1e1e22] transition-colors rounded-lg border-b border-gray-800 last:border-b-0 group">
          {/* Token Image */}
          <div className="relative">
            <img 
              src={`https://emerald-managerial-firefly-535.mypinata.cloud/ipfs/${tokenThumbail}`}
              alt={tokenName}
              className="w-16 h-16 object-cover rounded-lg group-hover:ring-2 group-hover:ring-orange-500/50 transition-all"
              loading="lazy"
            />
          </div>

          {/* Token Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate text-lg">{tokenName}</h3>
            <p className="text-sm text-gray-400 truncate">
              {user?.userInfo?.name || 'Anonymous'}
            </p>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-white font-medium">{availableToken}</div>
                <div className="text-gray-400 text-xs">Available</div>
              </div>
              <div className="text-center">
                <div className="text-white font-medium">{(tokenPrice / 10000).toFixed(4)}</div>
                <div className="text-gray-400 text-xs">ETH</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(TokenTile);
