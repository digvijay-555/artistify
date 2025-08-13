// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SongFractionalized.sol";
import "./SongEscrow.sol";

contract FractionPurchase {
    SongFractionalized public songFractionalized;
    SongEscrow public songEscrow;

    constructor(address payable _songFractionalized, address payable _songEscrow) {
        songFractionalized = SongFractionalized(_songFractionalized);
        songEscrow = SongEscrow(_songEscrow);
    }

    function buyFraction(uint256 songId, uint256 amount) external payable {
        // Use the getter function to retrieve the Song details
        SongFractionalized.Song memory song = songFractionalized.getSong(songId);

        require(song.isListed, "Song has not been listed yet");
        require(amount > 0, "Must buy at least one fraction");
        require(msg.value == song.fractionPrice * amount, "Incorrect Ether sent");

        // Transfer fractions to buyer
        songFractionalized.transferFraction(msg.sender, songId, amount);

        // Send funds to SongEscrow for safe holding
        (bool success, ) = address(songEscrow).call{value: msg.value}("");
        require(success, "Failed to transfer Ether to escrow");
    }
}