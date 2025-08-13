// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SongFractionalized is ERC1155, Ownable {
    constructor() ERC1155("https://api.example.com/metadata/{id}.json") Ownable(msg.sender) {
    }

    struct Song {
        string title;
        string artistName;
        address artistAddress;
        uint256 releaseTime;
        uint256 fractionPrice; 
        uint256 totalFractions;
        bool isReleased;
        bool isListed;
    }

    mapping(uint256 => Song) public songs;
    mapping(uint256 => uint256) public fractionsSold;
    mapping(uint256 => address[]) public fractionHolders; 

    uint256 public songCounter;

    // Function to list a song for sale
    function listSong(
        string memory title, 
        string memory artistName, 
        uint256 releaseTime, 
        uint256 fractionPrice, 
        uint256 totalFractions
    ) external {
        require(releaseTime > block.timestamp, "Release time must be in the future");

        songCounter++;
        songs[songCounter] = Song(title, artistName, msg.sender, releaseTime, fractionPrice, totalFractions, false, true);

        // Mint the fractions to the artist
        _mint(msg.sender, songCounter, totalFractions, "");
    }

    function approve(address Fract) external onlyOwner {
        setApprovalForAll(Fract, true);
    }

    // Function to check if a song should be unlisted and unlist it
    function checkAndUnlist(uint256 songId) public {
        Song storage song = songs[songId];

        if (block.timestamp >= song.releaseTime && !song.isReleased) {
            song.isReleased = true;
        }

        if (block.timestamp > song.releaseTime && song.isListed) {
            song.isListed = false;
        }
    }

    function getSong(uint256 songId) external view returns (Song memory) {
        return songs[songId];
    }

    // Transfer fractions to a buyer and track the buyer
    function transferFraction(address buyer, uint256 songId, uint256 amount) external {
        checkAndUnlist(songId); 

        require(songs[songId].isListed, "Song is not listed");
        require(balanceOf(songs[songId].artistAddress, songId) >= amount, "Insufficient fractions");

        safeTransferFrom(songs[songId].artistAddress, buyer, songId, amount, "");
        fractionsSold[songId] += amount; 

        fractionHolders[songId].push(buyer);
    }

    // Function to get the balance of the sender for a specific song
    function balanceOfSender(uint256 songId) public view returns (uint256) {
        return balanceOf(msg.sender, songId);
    }

    // Function to get the current block timestamp
    function getCurrentBlockTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    // Function to get all fraction holders for a specific song
    function getFractionHolders(uint256 songId) external view returns (address[] memory) {
        return fractionHolders[songId];
    }
}