"use client";

import React, { useState } from "react";
import pinata from "@/lib/ipfs";

const Page = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileCID, setFileCID] = useState<string | null>(null);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // Upload the selected file to IPFS
  const uploadFile = async () => {
    try {
      if (!selectedFile) {
        alert("Please select a file.");
        return;
      }

      // Create FormData and append the selected file
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Upload the file to IPFS using Pinata
      const uploadResponse = await pinata.upload.file(formData);
      console.log("File CID:", uploadResponse.IpfsHash);

      // Set the uploaded file CID
      setFileCID(uploadResponse.IpfsHash);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h1>Upload File to IPFS</h1>
      
      {/* File input */}
      <input type="file" onChange={handleFileChange} />
      
      {/* Upload button */}
      <button onClick={uploadFile}>Upload File</button>
      
      {/* Display the file CID */}
      {fileCID && (
        <p>
          <strong>File CID:</strong> {fileCID}
        </p>
      )}
    </div>
  );
};

export default Page;
