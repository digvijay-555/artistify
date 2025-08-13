// Loader.tsx
import React from 'react';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-[#0a0a0a]">
            <div className="loader"></div>
            <style jsx>{`
                .loader {
                    border: 8px solid #131316;
                    border-top: 8px solid #f97316;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 2s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loader;