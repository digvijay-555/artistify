'use client';

import { CircularProgress } from '@mui/joy';
import { useRouter } from 'next/navigation';

export default function UserInformation({ user }: { user: any }) {
  const router = useRouter();

  const handleOnboard = () => {
    router.push(`/onboard/${user.accountAddress}`);
  };

  return (
    <div className='w-full flex items-center justify-between px-20 py-12 bg-[#18181a]'>
      <div className='flex justify-center gap-6'>
        <div className='w-20 h-20 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-full'></div>
        <div className='flex flex-col justify-center'>
          <p className='text-xl font-medium'>{user.accountAddress.substr(0, 6) + "..." + user.accountAddress.substr(user.accountAddress.length - 3, user.accountAddress.length - 1)}</p>
          <p className='opacity-60'>{user.accountAddress.substr(0, 6) + "..." + user.accountAddress.substr(user.accountAddress.length - 3, user.accountAddress.length - 1)}</p>
        </div>
      </div>
      <div className='flex items-center gap-6'>
        <div className='fex flex-col justify-center'>
          {/* <p>Complete your Profile</p> */}
          <button onClick={handleOnboard} className='text-center bg-[#5b5bd5] px-4 py-2 rounded-xl'>OnBoard Now</button>
        </div>
        <CircularProgress size="lg" determinate value={66.67} color={'neutral'} variant='solid'>
          <p className='text-white'>2 / 3</p>
        </CircularProgress>
      </div>
    </div>
  );
}