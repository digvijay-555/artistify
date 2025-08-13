import { NextRequest, NextResponse } from 'next/server';
import pinata from '@/lib/ipfs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create FormData for Pinata
    const pinataFormData = new FormData();
    pinataFormData.append('file', file);

    // Upload to IPFS using existing Pinata configuration
    const uploadResponse = await pinata.upload.file(pinataFormData);
    
    return NextResponse.json({ 
      hash: uploadResponse.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${uploadResponse.IpfsHash}`
    }, { status: 200 });
    
  } catch (error) {
    console.error('IPFS upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload to IPFS' 
    }, { status: 500 });
  }
}
