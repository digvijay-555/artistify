'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FaSpinner } from 'react-icons/fa';
import { logInUser } from '@/lib/actions/user.actions';
import { useAuth } from '@campnetwork/origin/react';

const ConnectWalletButton = () => {
  const router = useRouter();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  // Use Origin SDK auth state
  const walletConnected = auth.isAuthenticated;
  const address = auth.walletAddress;

  useEffect(() => {
    // If user is authenticated via Origin SDK, create user in database
    if (auth.isAuthenticated && auth.walletAddress) {
      const createUser = async () => {
        try {
          await logInUser(auth.walletAddress!); // Non-null assertion since we check above
          console.log('User logged in via Origin SDK:', auth.walletAddress);
        } catch (error) {
          console.error('Error creating user:', error);
        }
      };
      createUser();
    }
  }, [auth.isAuthenticated, auth.walletAddress]);

  const connectWallet = async () => {
    // Since we're using Origin SDK, we don't need manual wallet connection
    // The Origin modal handles this
    console.log('Please use the Origin authentication modal to connect your wallet');
  };

  const disconnectWallet = () => {
    // Use Origin SDK disconnect (check if disconnect method exists)
    if ('disconnect' in auth && typeof auth.disconnect === 'function') {
      auth.disconnect();
    }
    router.push('/');
  };

  return (
    walletConnected ? (
      <div className="flex items-center space-x-4">
        <button className="relative bg-[#5b5bd5] text-white px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg border-2 border-transparent hover:border-gradient-to-r from-green-400 to-green-600 transition duration-300">
          <span className="relative flex items-center space-x-2">
            <FontAwesomeIcon icon={faWallet} />
            <span>{address?.substr(0, 6) + "..." + address?.substr(address.length - 4, address.length - 1)}</span>
          </span>
        </button>
        <button onClick={disconnectWallet} className="relative bg-[#5b5bd5] text-white px-4 py-3 rounded-xl flex items-center shadow-lg border-2 border-transparent hover:border-gradient-to-r from-red-400 to-red-600 transition duration-300">
          <span className="relative flex items-center">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </span>
        </button>
      </div>
    ) : (
      <button onClick={connectWallet} className="relative text-white px-4 py-3 rounded-xl flex items-center space-x-2 shadow-lg border-2 border-transparent hover:border-gradient-to-r from-blue-400 to-blue-600 transition duration-300">
        {loading ? (
          <FaSpinner className="animate-spin text-[#5b5bd5]" />
        ) : (
          <>
            <FontAwesomeIcon icon={faWallet} />
            <span>Connect Wallet</span>
          </>
        )}
      </button>
    )
  );
};

export default memo(ConnectWalletButton);