'use client';

import React, { useEffect, useState } from 'react';
import { FaMusic, FaUsers, FaEthereum, FaFire } from 'react-icons/fa';

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalTokens: 0,
    totalArtists: 0,
    totalVolume: 0,
    activeListeners: 0
  });

  // Simulate loading stats (you can replace with actual API calls)
  useEffect(() => {
    const animateStats = () => {
      const targetStats = {
        totalTokens: 1247,
        totalArtists: 89,
        totalVolume: 45.7,
        activeListeners: 2834
      };

      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          totalTokens: Math.floor(targetStats.totalTokens * progress),
          totalArtists: Math.floor(targetStats.totalArtists * progress),
          totalVolume: parseFloat((targetStats.totalVolume * progress).toFixed(1)),
          activeListeners: Math.floor(targetStats.activeListeners * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setStats(targetStats);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  const statItems = [
    {
      icon: FaMusic,
      label: "Music NFTs",
      value: stats.totalTokens.toLocaleString(),
      suffix: "",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaUsers,
      label: "Artists",
      value: stats.totalArtists.toLocaleString(),
      suffix: "+",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaEthereum,
      label: "Trading Volume",
      value: stats.totalVolume.toLocaleString(),
      suffix: "CAMP",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaFire,
      label: "Active Users",
      value: stats.activeListeners.toLocaleString(),
      suffix: "",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Platform <span className="bg-gradient-to-r from-[#5b5bd5] to-[#8b7bd5] bg-clip-text text-transparent">Statistics</span>
          </h2>
          <p className="text-xl text-gray-400">
            See how our community is growing and thriving
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold text-white">
                  {item.value}{item.suffix}
                </div>
                <div className="text-lg text-gray-400 font-medium">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(StatsSection);
