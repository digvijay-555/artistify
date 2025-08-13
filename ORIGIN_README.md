# Sound-Stake Origin SDK Integration

This implementation demonstrates the integration of **Camp Network's Origin SDK** with the Sound-Stake platform, showcasing modern Web3 authentication and NFT minting capabilities.

## 🚀 Features

### Origin SDK Integration
- **useAuth Hook**: Seamless authentication state management
- **CampModal Component**: User-friendly wallet connection interface
- **Web3 Provider**: Integrated ethers.js for blockchain interactions

### Core Functionality
- 🔐 **Wallet Authentication** via Origin SDK
- 🎵 **NFT Minting** with custom metadata
- 📁 **IPFS File Upload** for decentralized storage
- 🎨 **Dark/Light Theme** support with system preference detection
- 📱 **Responsive Design** optimized for all devices
- 🔗 **Transaction Tracking** with BlockScout integration

## 🛠️ Technical Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Web3**: Origin SDK + Ethers.js
- **Storage**: IPFS via Pinata
- **Blockchain**: Base Network (Camp testnet compatible)
- **Styling**: Tailwind CSS with dark mode support

## 📋 API Endpoints

### `/api/uploadToIPFS`
```typescript
POST /api/uploadToIPFS
Content-Type: multipart/form-data

Body: FormData with 'file' field
Response: { hash: string, url: string }
```

### `/api/uploadMetadataToIPFS`
```typescript
POST /api/uploadMetadataToIPFS
Content-Type: application/json

Body: { name, description, image, attributes }
Response: { hash: string, url: string }
```

## 🎯 Key Components

### 1. Authentication Flow
```tsx
const { origin } = useAuth();
// Access to Origin SDK authentication state
```

### 2. Wallet Connection
```tsx
<CampModal />
// Origin SDK's built-in wallet connection modal
```

### 3. NFT Minting Process
1. **File Upload**: User selects image file
2. **IPFS Upload**: File uploaded to decentralized storage
3. **Metadata Creation**: JSON metadata with NFT properties
4. **Smart Contract**: ERC721 safeMint function call
5. **Transaction Tracking**: BlockScout integration for verification

### 4. Theme System
- Automatic dark/light mode detection
- User preference persistence
- System theme integration
- Smooth transitions

## 🔧 Configuration

### Environment Variables
```env
PINATA_JWT=your_pinata_jwt_token
ORIGIN_CLIENT_ID=your_origin_client_id
```

### Smart Contract Setup
```javascript
const ERC721ABI = [
  "function safeMint(address to, string tokenURI) public",
  // ... other ERC721 functions
];

const CA_ADDRESS = "0xC562c59452c2C721d22353dE428Ec211C4069f60";
```

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

### Interactive Elements
- Loading states with spinner animations
- File preview functionality
- Form validation and error handling
- Success/error status messages

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## 🔒 Security Considerations

1. **File Validation**: Image type and size validation
2. **Error Handling**: Comprehensive try-catch blocks
3. **Input Sanitization**: Form data validation
4. **Transaction Safety**: User confirmation before minting

## 📱 User Journey

1. **Landing**: User sees the main interface
2. **Connection**: Click CampModal to connect wallet
3. **Creation**: Fill NFT details and upload image
4. **Minting**: Confirm transaction and wait for completion
5. **Success**: View minted NFT with transaction link

## 🔄 Integration Benefits

### For Sound-Stake Platform
- Modern authentication system
- Simplified Web3 onboarding
- Enhanced user experience
- Reduced development complexity

### For Users
- Familiar wallet connection flow
- Seamless Cross-platform compatibility
- Enhanced security
- Better mobile experience

## 🚀 Future Enhancements

- **Batch Minting**: Multiple NFTs in single transaction
- **Collection Management**: Organize NFTs into collections
- **Advanced Metadata**: Rich media support
- **Social Features**: Share and showcase NFTs
- **Analytics**: Minting statistics and insights

## 🔗 Resources

- [Origin SDK Documentation](https://docs.campnetwork.xyz)
- [Camp Network](https://campnetwork.xyz)
- [Base Network](https://base.org)
- [IPFS Documentation](https://docs.ipfs.io)

This implementation serves as a foundation for building sophisticated Web3 applications with modern authentication and seamless user experiences.
