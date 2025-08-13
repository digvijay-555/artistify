'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import TokenTile from '@/components/cards/TokenTile';
import HeroSection from '@/components/sections/HeroSection';
import Link from 'next/link';

interface Token {
  id: string;
  tokenThumbail: string;
  tokenName: string;
  availableToken: number;
  tokenPrice: number;
  createdAt: string;
  tokenId: number;
  user: {
    userInfo: {
      name: string;
      profilePicture: string;
    };
  };
}

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/getMintedTokens');
      setTokens(response.data.mintedTokens || []);
    } catch (error) {
      console.error('Error fetching minted tokens:', error);
      setError('Failed to load tokens');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // Get latest 6 tokens for display
  const latestTokens = React.useMemo(() => {
    return [...tokens]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [tokens]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <HeroSection />
      
      {/* Latest Drops Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light text-white">Latest Drops</h2>
            <Link href="/collection" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
              View All →
            </Link>
          </div>
          
          <div className="bg-[#131316] rounded-lg overflow-hidden">
            {loading ? (
              <div className="text-center py-12 text-gray-400">
                Loading...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-400">
                {error}
              </div>
            ) : latestTokens.length > 0 ? (
              latestTokens.map((token) => (
                <TokenTile
                  key={token.id}
                  {...token}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                No tokens available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Platform Updates Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-light text-white mb-8">Platform Updates</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#131316] p-6 rounded-lg hover:bg-[#1a1a1f] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-400 text-sm">2 days ago</span>
              </div>
              <h3 className="text-white font-medium mb-2">Enhanced Analytics Dashboard</h3>
              <p className="text-gray-400 text-sm">
                Track your portfolio performance with new detailed analytics and revenue insights.
              </p>
            </div>
            
            <div className="bg-[#131316] p-6 rounded-lg hover:bg-[#1a1a1f] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-gray-400 text-sm">Coming Soon</span>
              </div>
              <h3 className="text-white font-medium mb-2">Mobile App Beta Launch</h3>
              <p className="text-gray-400 text-sm">
                Access your music investments on-the-go with our new mobile application.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}