
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
      await onboardUser(formData, address);

      // Navigate to the portfolio page after successful onboarding
      router.push(`/portfolio/${address}`);
    } catch (error) {
      console.error('Error during onboarding:', error);
      alert('Failed to onboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#18181a] flex justify-center items-center p-6">
      <div className="max-w-md w-full border border-gray-700 shadow-md rounded-lg px-8 py-12 mb-24">
        <h1 className="text-2xl font-bold mb-6">Onboard Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 border bg-[#27282d] border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#5b5bd5] focus:border-[#5b5bd5]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Instagram URL <span className='text-[#5b5bd5]'> (Optional)</span></label>
            <input
              type="url"
              value={instaAccUrl}
              onChange={(e) => setInstaAccUrl(e.target.value)}
              className="block w-full px-3 py-2 border bg-[#27282d] border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#5b5bd5] focus:border-[#5b5bd5]"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full mt-8 bg-[#5b5bd5] text-white px-4 py-2 rounded-md hover:bg-[#7070ed] focus:outline-none"
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
