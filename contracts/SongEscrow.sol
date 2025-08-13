// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SongFractionalized.sol";

contract SongEscrow {
    SongFractionalized public songFractionalized;

    constructor(address payable _songFractionalized) {
        songFractionalized = SongFractionalized(_songFractionalized);
    }

    // Function to release funds to the artist after the song release
    function releaseFunds(uint256 songId) external {
        // Use the getter function to retrieve the Song details
        SongFractionalized.Song memory song = songFractionalized.getSong(songId);

        // Ensure the song is unlisted and released by calling the updated _checkAndUnlist function
        songFractionalized.checkAndUnlist(songId);

        // Ensure the song is released
        require(song.isReleased, "Song has not been released yet");
        // Check that the caller is the artist
        require(song.artistAddress == msg.sender, "Only the artist can release funds");

        // Get the total amount of Ether stored in the contract (escrow)
        uint256 totalFunds = address(this).balance;
        require(totalFunds > 0, "No funds available");

        // Transfer the funds to the artist
        (bool success, ) = payable(song.artistAddress).call{value: totalFunds}("");
        require(success, "Transfer failed");
    }

    // Fallback function to accept Ether
    receive() external payable {}
}