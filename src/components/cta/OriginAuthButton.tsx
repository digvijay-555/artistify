'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, CampModal } from '@campnetwork/origin/react';
import { logInUser } from '@/lib/actions/user.actions';

const OriginAuthButton = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  // Handle login when auth state changes
  const handleAuthChange = async () => {
    if (auth.isAuthenticated && auth.walletAddress && !loading) {
      setLoading(true);
      try {
        // Create user in database using existing logic
        await logInUser(auth.walletAddress);
        console.log('User logged in with Origin SDK:', auth.walletAddress);
      } catch (error) {
        console.error('Error logging in user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    handleAuthChange();
  }, [auth.isAuthenticated, auth.walletAddress]);

  return (
    <div className="flex items-center gap-2">      
      <CampModal />
    </div>
  );
};

export default OriginAuthButton;
