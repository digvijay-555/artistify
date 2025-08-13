'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import pinata from '@/lib/ipfs';
import axios from 'axios';
import { uploadSong } from '@/lib/actions/song.actions';
import { FaSpinner } from 'react-icons/fa';

export interface UploadSongData {
  name: string;
  thumbnail: string;
  songCid: string;
  length: number;
  userAddress: string;
}

const UploadSongPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [selectedSongFile, setSelectedSongFile] = useState<File | null>(null);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  const [songCID, setSongCID] = useState<string | null>(null);
  const [thumbnailCID, setThumbnailCID] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserAddress = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const response = await axios.post('/api/verifyToken', { token }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            setAddress(response.data.userDetails.accountAddress);
          } else {
            console.error('Failed to verify token');
          }
        } catch (error) {
          console.error('Error fetching user address:', error);
        }
      }
    };

    fetchUserAddress();
  }, []);

  // Handle file change for song
  const handleSongFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedSongFile(file);
  };

  // Handle file change for thumbnail
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedThumbnailFile(file);
  };

  // Upload the selected song file to IPFS
  const uploadSongFile = async () => {
    try {
      if (!selectedSongFile) {
        alert('Please select a song file.');
        return;
      }

      setLoading(true);

      // Create FormData and append the selected song file
      const formData = new FormData();
      formData.append('file', selectedSongFile);

      // Upload the song file to IPFS using Pinata
      const uploadResponse = await pinata.upload.file(formData);
      console.log('Song CID:', uploadResponse.IpfsHash);

      // Set the uploaded song CID
      setSongCID(uploadResponse.IpfsHash);

      // Compute the length of the song
      const audio = new Audio(URL.createObjectURL(selectedSongFile));
      audio.onloadedmetadata = () => {
        const length = Math.round(audio.duration);
        console.log('Song Length:', length);
        setLoading(false);
      };
    } catch (error) {
      console.error('Error uploading song file:', error);
      setLoading(false);
    }
  };

  // Upload the selected thumbnail file to IPFS
  const uploadThumbnailFile = async () => {
    try {
      if (!selectedThumbnailFile) {
        alert('Please select a thumbnail file.');
        return;
      }

      setLoading(true);

      // Create FormData and append the selected thumbnail file
      const formData = new FormData();
      formData.append('file', selectedThumbnailFile);

      // Upload the thumbnail file to IPFS using Pinata
      const uploadResponse = await pinata.upload.file(formData);
      console.log('Thumbnail CID:', uploadResponse.IpfsHash);

      // Set the uploaded thumbnail CID
      setThumbnailCID(uploadResponse.IpfsHash);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading thumbnail file:', error);
      setLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    try {
      const { name } = data;

      if (!songCID || !thumbnailCID) {
        alert('Please upload both the song and thumbnail.');
        return;
      }

      // Compute the length of the song
      const audio = new Audio(URL.createObjectURL(selectedSongFile!));
      audio.onloadedmetadata = async () => {
        const length = Math.round(audio.duration);

        try {
          const uploadedSong = await uploadSong({
            name,
            thumbnail: thumbnailCID,
            songCid: songCID,
            length,
            userAddress: address || '',
          });

          console.log(uploadedSong);

          alert('Song uploaded successfully!');
          reset();
        } catch (error) {
          console.error('Error uploading song:', error);
          alert('Error uploading song');
        }
      };
    } catch (error) {
      console.error('Error uploading song:', error);
      alert('Error uploading song');
    }
  };

  return (
    <div className="min-h-screen bg-[#18181a] flex justify-center items-center p-6">
      <div className="flex w-full max-w-6xl shadow-md rounded-lg px-6 py-10 mb-24">
        <div className="w-1/2 flex flex-col items-center justify-center border border-gray-700 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-4">Upload Song</h1>
          <input
            type="file"
            accept="audio/*"
            onChange={handleSongFileChange}
            className="block w-full text-white rounded-md shadow-sm p-2 mb-4 pl-36"
          />
          <button
            type="button"
            onClick={uploadSongFile}
            className="bg-[#5b5bd5] text-white px-4 py-2 rounded-xl"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Upload Song'}
          </button>
          {songCID && (
            <div className="mt-4">
              <h2 className="text-xl font-bold text-white">Uploaded Song</h2>
              <audio controls className="mt-2">
                <source src={`https://ipfs.infura.io/ipfs/${songCID}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
        <div className="w-1/2 pl-6">
          <h1 className="text-3xl font-bold text-white mb-4">Song Details</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Song Name</label>
              <input
                type="text"
                {...register('name', { required: true })}
                className="mt-1 block w-full border bg-[#232328] border-gray-600 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                className="block w-full text-white rounded-md shadow-sm p-2 mb-4 pl-36"
              />
              <button
                type="button"
                onClick={uploadThumbnailFile}
                className="bg-[#5b5bd5] text-white px-4 py-2 rounded-xl"
              >
                {loading ? <FaSpinner className="animate-spin" /> : 'Upload Thumbnail'}
              </button>
              {thumbnailCID && (
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-white">Uploaded Thumbnail</h2>
                  <img src={`https://ipfs.infura.io/ipfs/${thumbnailCID}`} alt="Thumbnail" className="mt-2 rounded-lg" />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#5b5bd5] text-white px-4 py-2 rounded-xl"
            >
              Confirm Release 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadSongPage;