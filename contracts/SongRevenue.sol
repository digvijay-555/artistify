// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SongFractionalized.sol"; 

contract SongRevenue is Ownable {
    SongFractionalized public fractionalizedContract;

    constructor(address payable _songFractionalized) Ownable(msg.sender) {
        fractionalizedContract = SongFractionalized(_songFractionalized);
    }

    mapping(uint256 => uint256) public totalRevenue;

    // Function to add revenue for a song
    function addRevenue(uint256 songId) external payable {
        require(msg.value > 0, "Must send ether to add revenue");
        totalRevenue[songId] += msg.value; 
    }

    // Function to distribute revenue to the artist and fraction holders
    function distributeRevenue(uint256 songId) external {
        uint256 revenue = totalRevenue[songId];
        require(revenue > 0, "No revenue to distribute");

        uint256 artistShare = revenue / 2; 
        uint256 holdersShare = revenue - artistShare; 

        // Destructure the tuple returned by songs(songId)
        (, , address artistAddress, , , , , ) = fractionalizedContract.songs(songId);

        totalRevenue[songId] = 0;

        (bool success, ) = payable(artistAddress).call{value: artistShare}("");
        require(success, "Payment to artist failed");

        // Get fraction holders
        address[] memory holders = fractionalizedContract.getFractionHolders(songId);
        uint256 totalFractionsSold = fractionalizedContract.fractionsSold(songId);

        // Distribute the holders' share among fraction holders
        for (uint256 i = 0; i < holders.length; i++) {
            uint256 holderFractions = fractionalizedContract.balanceOf(holders[i], songId);
            if (holderFractions > 0) {
                uint256 holderShare = (holdersShare * holderFractions) / totalFractionsSold;
                (bool holderSuccess, ) = payable(holders[i]).call{value: holderShare}("");
                require(holderSuccess, "Payment to holder failed");
            }
        }
    }

    // Function to get total revenue for a song
    function getTotalRevenue(uint256 songId) external view returns (uint256) {
        return totalRevenue[songId];
    }

    function addFunds() public payable{
    }
}