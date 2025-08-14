'use client';

import React from 'react';
import { FaMusic, FaUsers, FaEthereum, FaArrowUp } from 'react-icons/fa';
import { useAuth } from '@campnetwork/origin/react';

const HeroSection = () => {
  const auth = useAuth();

  const stats = [
    { label: 'Total Volume', value: '847.3', unit: 'CAMP', icon: FaEthereum },
    { label: 'Active Artists', value: '156', unit: '+', icon: FaUsers },
    { label: 'Music NFTs', value: '2,847', unit: '', icon: FaMusic },
    { label: 'Growth', value: '+24%', unit: '', icon: FaArrowUp },
  ];

  return (
    <div className="bg-[#18181a] pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-white mb-2">Sound Stake</h1>
              <p className="text-gray-400">Fractionalized Music NFT Marketplace</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Market Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-orange-500 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#1e1e22] border border-gray-800 rounded-lg p-6 hover:border-orange-500/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5 text-orange-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</span>
              </div>
              <div className="text-2xl font-semibold text-white">
                {stat.value}<span className="text-sm text-gray-400 ml-1">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {auth.isAuthenticated && (
          <div className="flex gap-4 justify-center">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors">
              Create Drop
            </button>
            <button className="border border-gray-600 text-white px-6 py-2 rounded-md font-medium hover:border-orange-500 hover:text-orange-400 transition-colors">
              View Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(HeroSection);
