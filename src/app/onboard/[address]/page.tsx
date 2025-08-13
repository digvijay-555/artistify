
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { onboardUser } from '@/lib/actions/user.actions'; // Import the server action

export default function OnboardingPage({ params }: { params: { address: string } }) {
  const { address } = params;
  const [name, setName] = useState('');
  const [instaAccUrl, setInstaAccUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Create form data to send to the server action
    const formData = new FormData();
    formData.append('name', name);
    formData.append('instaAccUrl', instaAccUrl);

    try {
      // Use the server action directly
      const result = await onboardUser(formData, address);
      
      // Navigate to the portfolio page after successful onboarding
      router.push(`/portfolio/${address}`);
    } catch (error) {
      console.error('Error during onboarding:', error);
      
      // Just log the error without alerting the user
      if (error instanceof Error && 
         !error.message.includes('navigation') && 
         !error.message.includes('redirect')) {
        console.log('Failed to onboard. Please try again.');
      } else {
        // If it's a navigation error but database was updated, redirect manually
        router.push(`/portfolio/${address}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center p-6">
      <div className="max-w-md w-full border border-gray-700 shadow-md rounded-lg px-8 py-12 mb-24 bg-[#131316]">
        <h1 className="text-2xl font-bold mb-6 text-white">Onboard Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 border bg-[#1a1a1f] border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Instagram URL <span className='text-orange-500'> (Optional)</span></label>
            <input
              type="url"
              value={instaAccUrl}
              onChange={(e) => setInstaAccUrl(e.target.value)}
              className="block w-full px-3 py-2 border bg-[#1a1a1f] border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-white"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full mt-8 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none transition-colors"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
