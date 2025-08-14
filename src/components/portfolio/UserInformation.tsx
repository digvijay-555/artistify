'use client';

import { CircularProgress } from '@mui/joy';
import { useRouter } from 'next/navigation';

export default function UserInformation({ user }: { user: any }) {
  const router = useRouter();

  const handleOnboard = () => {
    router.push(`/onboard/${user.accountAddress}`);
  };

  return (
    <div className='w-full bg-[#0a0a0a]'>
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='flex items-center justify-between'>
          <div className='flex justify-center gap-6'>
            <div className='w-20 h-20 bg-gradient-to-r from-amber-400 to-red-400 rounded-full'></div>
            <div className='flex flex-col justify-center'>
              <p className='text-xl font-medium text-white'>{user.accountAddress.substr(0, 6) + "..." + user.accountAddress.substr(user.accountAddress.length - 3, user.accountAddress.length - 1)}</p>
              <p className='opacity-60 text-gray-400'>{user.accountAddress.substr(0, 6) + "..." + user.accountAddress.substr(user.accountAddress.length - 3, user.accountAddress.length - 1)}</p>
            </div>
          </div>
          <div className='flex items-center gap-6'>
            <div className='fex flex-col justify-center'>
              {/* <p>Complete your Profile</p> */}
              <button onClick={handleOnboard} className='text-center bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-2 rounded-xl text-white'>OnBoard Now</button>
            </div>
            <CircularProgress size="lg" determinate value={66.67} color={'neutral'} variant='solid'>
              <p className='text-white'>2 / 3</p>
            </CircularProgress>
          </div>
        </div>
      </div>
    </div>
  );
}