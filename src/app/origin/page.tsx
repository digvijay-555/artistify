'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth, CampModal } from "@campnetwork/origin/react";
import { ethers } from "ethers";

/* ===================== CONFIG ===================== */
const ERC721ABI = [
  "function safeMint(address to, string tokenURI) public",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function supportsInterface(bytes4 interfaceId) view returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
];

const CA_ADDRESS = "0xC562c59452c2C721d22353dE428Ec211C4069f60";
const BLOCKSCOUT_BASE = "https://basecamp.cloud.blockscout.com";

const THEME_IMAGES = {
  light: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  dark: "linear-gradient(135deg, #2c3e50 0%, #000000 100%)",
};

/* ===================== UTILS ===================== */
const ipfsToHttp = (uri: string) => {
  if (!uri) return null;
  if (uri.startsWith("ipfs://")) {
    const cid = uri.replace("ipfs://", "");
    return [
      `https://gateway.pinata.cloud/ipfs/${cid}`,
      `https://cloudflare-ipfs.com/ipfs/${cid}`,
      `https://ipfs.io/ipfs/${cid}`,
    ];
  }
  return [uri];
};

async function fetchJsonWithFallback(urls: string[]) {
  for (const u of urls) {
    try {
      const r = await fetch(u, { cache: "no-store" });
      if (r.ok) return await r.json();
    } catch (_) {}
  }
  throw new Error("Metadata fetch failed on all gateways");
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-8 text-black dark:text-white">
    <svg
      className="animate-spin h-10 w-10 text-gray-500 dark:text-gray-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.91l3-2.619z"
      ></path>
    </svg>
    <p className="mt-2 text-lg italic">⏳ Please wait...</p>
  </div>
);

/* ===================== MAIN COMPONENT ===================== */
export default function OriginAuthDemo() {
  const { origin } = useAuth();
  const [wallet, setWallet] = useState("");
  const [nftName, setNftName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [loadingMint, setLoadingMint] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastMintedTxHash, setLastMintedTxHash] = useState<string | null>(null);
  const [lastMintedNft, setLastMintedNft] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ===== Theme bootstrapping ===== */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setDarkMode(saved === "dark");
    } else {
      const prefersDark = window.matchMedia?.(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const currentHero = darkMode ? THEME_IMAGES.dark : THEME_IMAGES.light;
  const toggleTheme = () => setDarkMode((v) => !v);

  /* ===== Wallet events ===== */
  useEffect(() => {
    if (!window.ethereum) return;
    const onAccounts = (accs: string[]) => setWallet(accs?.[0] ?? "");
    const onChainChanged = () => window.location.reload();
    
    if (window.ethereum.on) {
      window.ethereum.on("accountsChanged", onAccounts);
      window.ethereum.on("chainChanged", onChainChanged);
    }
    
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", onAccounts);
        window.ethereum.removeListener("chainChanged", onChainChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("❌ Please install MetaMask.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWallet(accounts[0]);
      setStatus("✅ Wallet connected!");
    } catch {
      setStatus("❌ Wallet connection failed.");
    }
  };

  /* ===== Close menu on outside click / Esc ===== */
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setShowMenu(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setShowMenu(false);
    if (showMenu) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [showMenu]);

  /* ===== File handling ===== */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setStatus("❌ File must be an image.");
      return;
    }
    const MAX = 10 * 1024 * 1024; // 10MB
    if (f.size > MAX) {
      setStatus("❌ File too large (max 10MB).");
      return;
    }
    setFile(f);
  };

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  /* ===== IPFS Upload ===== */
  const uploadToIPFS = async (file: File) => {
    setStatus("⏳ Uploading file to IPFS...");
    
    // Use your existing Pinata configuration
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      // Upload file to IPFS using your existing Pinata setup
      const response = await fetch('/api/uploadToIPFS', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('IPFS upload failed');
      }
      
      const result = await response.json();
      const fileUrl = `ipfs://${result.hash}`;
      
      // Create metadata
      const metadata = {
        name: nftName,
        description: `An NFT by ${creatorName}`,
        image: fileUrl,
        attributes: [{ trait_type: "Creator", value: creatorName }],
      };
      
      setStatus("⏳ Uploading metadata to IPFS...");
      
      // Upload metadata
      const metaResponse = await fetch('/api/uploadMetadataToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });
      
      if (!metaResponse.ok) {
        throw new Error('Metadata upload failed');
      }
      
      const metaResult = await metaResponse.json();
      return `ipfs://${metaResult.hash}`;
    } catch (error) {
      throw new Error(`IPFS upload failed: ${error}`);
    }
  };

  /* ===== Mint ===== */
  const provider = useMemo(() => {
    if (!window.ethereum) return null;
    return new ethers.providers.Web3Provider(window.ethereum);
  }, []);

  const signer = useMemo(() => {
    try {
      return provider?.getSigner();
    } catch {
      return null;
    }
  }, [provider]);

  const contract = useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(CA_ADDRESS, ERC721ABI, signer);
  }, [signer]);

  const mintNFT = async (tokenURIOverride?: string) => {
    if (!wallet) {
      setStatus("❌ Connect your wallet first.");
      return;
    }
    if (!tokenURIOverride && (!nftName || !creatorName || !file)) {
      setStatus("❌ Fill all fields or provide a tokenURI.");
      return;
    }
    if (!contract) {
      setStatus("❌ Contract not ready.");
      return;
    }
    setLoadingMint(true);
    setStatus("⏳ Preparing to mint...");
    try {
      const tokenURI = tokenURIOverride || (await uploadToIPFS(file!));
      setStatus(`✅ Metadata ready. Confirm the transaction...`);
      const tx = await contract.safeMint(wallet, tokenURI);
      setStatus(`⏳ Transaction sent. Waiting confirmation… Tx: ${tx.hash}`);
      await tx.wait(1);
      setLastMintedTxHash(tx.hash);
      setStatus(`🎉 NFT minted!`);
      
      const urls = ipfsToHttp(tokenURI);
      if (urls) {
        const meta = await fetchJsonWithFallback(urls);
        const imageUrls = ipfsToHttp(meta.image);
        setLastMintedNft({
          name: meta.name,
          creator:
            meta.attributes?.find((a: any) => a.trait_type === "Creator")?.value ||
            "Unknown",
          imageUrl: imageUrls?.[0],
          txHash: tx.hash,
        });
      }
    } catch (error: any) {
      console.error(error);
      setStatus(`❌ Minting failed: ${error.message || "Unknown error"}`);
    } finally {
      setLoadingMint(false);
    }
  };

  const resetMintingState = () => {
    setNftName("");
    setCreatorName("");
    setFile(null);
    setPreviewUrl(null);
    setStatus("");
    setLastMintedNft(null);
    setLastMintedTxHash(null);
  };

  /* ===================== UI ===================== */
  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-start gap-10 font-sans ${
        darkMode ? "dark text-white" : "text-black"
      }`}
    >
      {/* Background image layer */}
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover bg-no-repeat pointer-events-none"
        style={{ background: currentHero }}
        aria-hidden="true"
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* All content */}
      <div className="relative z-30">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4" ref={menuRef}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="bg-white text-black dark:bg-gray-700 dark:text-white px-4 py-2 rounded shadow-md"
              aria-haspopup="menu"
              aria-expanded={showMenu}
            >
              ☰ Menu
            </button>
            {showMenu && (
              <div className="absolute top-16 left-4 mt-2 bg-white dark:bg-gray-700 text-black dark:text-white rounded shadow-md p-3 space-y-2 z-50">
                {[
                  ["home", "🏠 Home"],
                  ["about", "ℹ️ About Origin SDK"],
                ].map(([key, label]) => (
                  <div
                    key={key}
                    onClick={() => {
                      setActivePage(key);
                      setShowMenu(false);
                    }}
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 p-1 rounded"
                    role="menuitem"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (setActivePage(key), setShowMenu(false))
                    }
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded shadow-md"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <CampModal />
          </div>
        </div>

        {/* Header */}
        <header className="text-white text-center pt-24 pb-10 px-4">
          <h1 className="text-8xl font-extrabold bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent drop-shadow-lg">
            Sound-Stake Origin
          </h1>
          <p className="text-xl sm:text-3xl font-inter font-bold text-white drop-shadow-[0_0_15px_black] mb-4">
            "Origin SDK Integration Demo"
          </p>
          {!wallet ? (
            <button
              onClick={connectWallet}
              className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md text-sm"
            >
              Connect Wallet
            </button>
          ) : (
            <p className="mt-4 text-sm text-white font-mono" title={wallet}>
              🔗 {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </p>
          )}
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6">
          {activePage === "home" && (
            <div className="w-full max-w-5xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-md space-y-6 flex flex-col items-center">
              {loadingMint ? (
                <LoadingSpinner />
              ) : lastMintedNft ? (
                <div className="flex flex-col items-center justify-center gap-6 w-full text-black dark:text-white">
                  <div className="w-48 h-48 sm:w-64 sm:h-64 p-2 rounded-xl border-4 border-green-500 bg-white/80 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={lastMintedNft.imageUrl}
                      alt={lastMintedNft.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className="text-lg sm:text-xl font-bold">
                    🎉 Minting Successful!
                  </p>
                  <p className="text-base sm:text-lg">
                    <strong>NFT:</strong> {lastMintedNft.name}
                  </p>
                  <p className="text-sm">
                    <strong>Creator:</strong> {lastMintedNft.creator}
                  </p>
                  <a
                    href={`${BLOCKSCOUT_BASE}/tx/${lastMintedNft.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-sm text-blue-200 underline"
                  >
                    View Transaction on BlockScout
                  </a>
                  <button
                    onClick={resetMintingState}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-sm transition"
                  >
                    Mint Another NFT
                  </button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row justify-center items-center gap-6 w-full">
                  {previewUrl && (
                    <div className="w-32 h-32 sm:w-48 sm:h-48 p-2 rounded-xl border-4 border-white/50 dark:border-gray-500 bg-white/10 dark:bg-gray-800/10 flex items-center justify-center overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="File Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-center gap-4 w-full">
                    <div className="w-full flex flex-col sm:flex-row sm:gap-4 gap-2 justify-center items-center">
                      <input
                        type="text"
                        placeholder="NFT Name"
                        value={nftName}
                        onChange={(e) => setNftName(e.target.value)}
                        className="w-full px-4 py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                      <input
                        type="text"
                        placeholder="Creator Name"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        className="w-full px-4 py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
                    <div className="w-full flex flex-col sm:flex-row sm:gap-4 gap-2 justify-center items-center">
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer w-full px-4 sm:px-6 py-3 text-sm sm:text-base rounded-lg text-white font-semibold transition bg-gray-600 hover:bg-gray-700 text-center"
                      >
                        📁{" "}
                        {file
                          ? file.name.length > 24
                            ? file.name.slice(0, 24) + "…"
                            : file.name
                          : "Upload Image"}
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        onClick={() => mintNFT()}
                        disabled={
                          !wallet ||
                          !nftName ||
                          !creatorName ||
                          !file ||
                          loadingMint
                        }
                        className={`w-full px-4 sm:px-6 py-3 text-sm sm:text-base rounded-lg text-white font-semibold transition ${
                          !wallet ||
                          !nftName ||
                          !creatorName ||
                          !file ||
                          loadingMint
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {loadingMint ? "Minting..." : "🪄 Upload & Mint"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {status && (
                <div className="text-center px-4">
                  {status.startsWith("🎉") ? (
                    <p className="text-lg font-bold text-black dark:text-white">
                      {status}
                    </p>
                  ) : status.startsWith("❌") ? (
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      {status}
                    </p>
                  ) : (
                    <p className="text-base font-medium text-black dark:text-white">
                      {status}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {activePage === "about" && (
            <div className="w-full max-w-3xl bg-white/80 text-black backdrop-blur p-4 sm:p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">ℹ️ About Origin SDK Integration</h2>
              <p className="text-sm leading-relaxed">
                <strong>Sound-Stake Origin Demo</strong> showcases the integration of{" "}
                <a href="https://campnetwork.xyz" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                  <strong>Camp Network's Origin SDK</strong>
                </a>{" "}
                with our music staking platform.<br /><br />
                
                This implementation demonstrates:
                <ul className="list-disc ml-5 mt-1">
                  <li>🔐 <strong>useAuth</strong> hook for authentication state management</li>
                  <li>🎯 <strong>CampModal</strong> component for seamless wallet connection</li>
                  <li>🛠 <strong>Origin SDK</strong> integration for Web3 interactions</li>
                  <li>🎵 <strong>NFT Minting</strong> capabilities for music assets</li>
                  <li>🌐 <strong>IPFS Integration</strong> for decentralized storage</li>
                  <li>🎨 <strong>Dark/Light Mode</strong> theme support</li>
                </ul>
                <br />
                
                <strong>Key Features:</strong><br />
                • Wallet connection via Origin SDK<br />
                • NFT minting with metadata storage<br />
                • File upload to IPFS<br />
                • Transaction tracking on BlockScout<br />
                • Responsive design with Tailwind CSS<br /><br />
                
                This integration serves as a foundation for building more complex DeFi and NFT applications on the Camp Network ecosystem.
              </p>
            </div>
          )}
        </main>

        <footer className="text-center py-4 text-sm text-white bg-black/60 dark:bg-gray-800">
          &copy; {new Date().getFullYear()} Sound-Stake Origin Demo. Powered by Camp Network.
        </footer>
      </div>
    </div>
  );
}