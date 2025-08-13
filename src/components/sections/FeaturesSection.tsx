'use client';

import React from 'react';
import { FaMusic, FaShareAlt, FaChartLine, FaShieldAlt, FaGem, FaUsers } from 'react-icons/fa';

const FeaturesSection = () => {
  const features = [
    {
      icon: FaMusic,
      title: "Fractionalized Music NFTs",
      description: "Own a piece of your favorite songs. Buy fractions of music NFTs and earn from their success.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaShareAlt,
      title: "Revenue Sharing",
      description: "Earn passive income from streaming royalties and music sales as a fractional owner.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaChartLine,
      title: "Trading Marketplace",
      description: "Buy, sell, and trade music fractions on our decentralized marketplace.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaShieldAlt,
      title: "Blockchain Security",
      description: "All transactions are secured by smart contracts on the Ethereum blockchain.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: FaGem,
      title: "Exclusive Access",
      description: "Get VIP access to concerts, meet & greets, and exclusive content from artists.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: FaUsers,
      title: "Community Driven",
      description: "Join a community of music lovers and investors shaping the future of music.",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <div className="bg-[#18181a] py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Why Choose <span className="bg-gradient-to-r from-[#5b5bd5] to-[#8b7bd5] bg-clip-text text-transparent">Artistify</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're revolutionizing how artists monetize their music and how fans connect with their favorite songs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#232328] rounded-2xl p-8 hover:bg-[#2a2a30] transition-all duration-300 hover:scale-105 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(FeaturesSection);
