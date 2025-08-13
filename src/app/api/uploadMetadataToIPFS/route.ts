import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const metadata = await request.json();
    
    if (!metadata) {
      return NextResponse.json({ error: 'No metadata provided' }, { status: 400 });
    }

    // Get Pinata JWT from environment or use the existing configuration
    const jwt = process.env.PINATA_JWT || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMWZiYzQ4YS0yODljLTRkMjgtOWViZS02ZjkzMWVjMzhiMTgiLCJlbWFpbCI6Imx1Y2lmZXJ4dmlzaGFsMTNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjE3MmUwMGEzMGE5ZWI5MzBlOWEyIiwic2NvcGVkS2V5U2VjcmV0IjoiOWQ0Njk5OWQ5OGVkMmYwMDkwMDA5NDRmMThkMTc2NjllNDQ4NDkzZmU4MDM2OGU2NzVmY2FlY2QxNDllZDFkMiIsImV4cCI6MTc1OTM1MTg0OH0.n76jTUin4w69mfYacBHP7hoKJnHApHxBJXnw8asbOnM";
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
      }
    );

    return NextResponse.json({ 
      hash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    }, { status: 200 });
    
  } catch (error) {
    console.error('Metadata upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload metadata to IPFS' 
    }, { status: 500 });
  }
}
