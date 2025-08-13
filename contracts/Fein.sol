// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Fein is ERC1155 {
    uint256 public currentTokenID = 0;
    address public contractOwner;

    struct data {
        uint256 tokenSupply;
        string uri;
        address creator;
        uint256 countoftotalsupply;
        // address[] participants;
        uint256 fundsCollected;
        uint256 revenue;
        uint256 totalFractionalAmount;
        // mapping(address => uint) fractionalOwnership;
        bool soldOut;
        bool isReleased;
        uint256 percentageShare;
        uint256 pricePerToken;
    }

    mapping(uint256 => data) public tokenData;
    mapping(uint256 => address[]) public participants;
    mapping(uint256 => mapping(address => uint256)) public fractionalOwnership;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 totalSupply,
        uint256 totalFractionalAmount
    );
    event RevenueDistributed(uint256 indexed tokenId, uint256 amount);
    event FundsAdded(uint256 indexed tokenId, uint256 amount);
    event StakePurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 tokensPurchased,
        uint256 amountPaid
    );

    constructor()
        ERC1155(
            "https://apricot-adorable-buzzard-685.mypinata.cloud/ipfs/QmafYVRMa9aWj2QZACYeUfbDXttryS5SydazdijXcNVfms/"
        )
    {
        contractOwner = msg.sender;
    }

    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    // Mint a new NFT representing a song with fractional ownership
    function mintNFT(
        uint256 _totalSupply,
        uint256 _totalFractionalAmount,
        uint256 _percentageShare
    ) external returns (uint256) {
        uint256 _id = currentTokenID;

        _mint(msg.sender, _id, _totalSupply, ""); // Mint one NFT with total supply representing fractions
        tokenData[_id].uri = string(
            abi.encodePacked(
                "https://apricot-adorable-buzzard-685.mypinata.cloud/ipfs/QmafYVRMa9aWj2QZACYeUfbDXttryS5SydazdijXcNVfms/",
                Strings.toString(_id),
                ".json"
            )
        );
        tokenData[_id].tokenSupply = _totalSupply;
        tokenData[_id].countoftotalsupply = _totalSupply;
        tokenData[_id].creator = msg.sender;
        tokenData[_id].totalFractionalAmount = _totalFractionalAmount;
        tokenData[_id].fundsCollected = 0;
        currentTokenID++;
        tokenData[_id].soldOut = false;
        tokenData[_id].isReleased = false;
        tokenData[_id].percentageShare = _percentageShare;
        tokenData[_id].pricePerToken =
            tokenData[_id].totalFractionalAmount /
            tokenData[_id].countoftotalsupply;

        emit NFTMinted(_id, msg.sender, _totalSupply, _totalFractionalAmount);
        return _id;
    }

    // Set the URI for a specific token ID
    // function _setTokenURI(uint256 tokenId, string memory _uri) internal {
    //     tokenData[tokenId].uri = _uri;
    // }

    // Override the uri function to return the correct metadata URI
    function geturi(uint256 _tokenid) public view returns (string memory) {
        return tokenData[_tokenid].uri;
    }

    // Buy stakes in an NFT by specifying the number of tokens
function buyStake(uint256 tokenId, uint256 number) external payable {
        uint256 availableFraction = tokenData[tokenId].tokenSupply;
        require(tokenData[tokenId].soldOut == false, "Token is sold out");
        require(availableFraction > 0, "No fractional ownership available");
        require(
            availableFraction >= number,
            "Not enough fractional ownership available"
        );

        //uint256 pricePerToken = tokenData[tokenId].totalFractionalAmount / tokenData[tokenId].countoftotalsupply;
        uint256 requiredAmount = tokenData[tokenId].pricePerToken*number;

        // Ensure enough ETH is sent (should be handled by the front-end)
        require(msg.value >= requiredAmount, "Incorrect amount of ETH sent");

        if (fractionalOwnership[tokenId][msg.sender] == 0) {
            participants[tokenId].push(msg.sender);
        }

        fractionalOwnership[tokenId][msg.sender]++;
        tokenData[tokenId].fundsCollected += msg.value;
        tokenData[tokenId].tokenSupply-=number;

        emit StakePurchased(tokenId, msg.sender, number, requiredAmount);

        // If all fractions are sold, mark as sold out
        if (tokenData[tokenId].tokenSupply == 0) {
            tokenData[tokenId].soldOut = true;
        }
    }

    // Distribute revenue to all token holders based on their fractional ownership
    function distributeRevenue(uint256 tokenId) public payable onlyOwner {
        uint256 amountToDistribute = (tokenData[tokenId].revenue *
            tokenData[tokenId].percentageShare) / 100;

        require(
            tokenData[tokenId].isReleased == true,
            "Song must be released to distribute revenue"
        );
        require(amountToDistribute > 0, "No funds available for distribution");

        uint256 totalFraction = tokenData[tokenId].totalFractionalAmount;
        require(totalFraction > 0, "No fractions sold");

        for (uint256 i = 0; i < participants[tokenId].length; i++) {
            address receiver = participants[tokenId][i];
            uint256 holderFraction = fractionalOwnership[tokenId][receiver];
            if (holderFraction > 0) {
                uint256 share = (amountToDistribute * holderFraction) /
                    tokenData[tokenId].countoftotalsupply;
                payable(receiver).transfer(share);
            }
        }
        uint256 artistShare = tokenData[tokenId].revenue - amountToDistribute;

        // Transfer artist share
        payable(tokenData[tokenId].creator).transfer(artistShare);

        // Distribute the revenue to participants

        emit RevenueDistributed(tokenId, amountToDistribute);
    }

    // Function for the owner to add revenue to a specific NFT
    function addRevenueGen(uint256 tokenId) public payable onlyOwner {
        require(
            tokenData[tokenId].totalFractionalAmount > 0,
            "NFT does not exist"
        );
        require(msg.value > 0, "No funds provided");
        tokenData[tokenId].revenue += msg.value;

        emit FundsAdded(tokenId, msg.value);
    }

    // Withdraw the contract's revenue for a specific token
    function withdrawFunds(uint256 tokenId) external onlyOwner {
        uint256 balance = tokenData[tokenId].revenue;
        require(balance > 0, "No funds to withdraw");
        payable(contractOwner).transfer(balance);
    }

    // Release the song (after all NFTs are sold)
    function releaseSong(uint256 tokenId) external {
        require(
            tokenData[tokenId].isReleased == false,
            "Song is already released"
        );
        tokenData[tokenId].isReleased = true;
    }

    // Transfer funds to the artist after all tokens are sold
    function artistTokenSales(uint256 tokenId) public payable onlyOwner {
        require(tokenData[tokenId].isReleased == true, "Song not released yet");
        payable(tokenData[tokenId].creator).transfer(
            tokenData[tokenId].fundsCollected
        );
    }

    function withdrawToOwner() public payable onlyOwner {
        // Transfer all the Ether in the contract to the owner
    }

    function getparticipants(
        uint _tokenId
    ) public view returns (address[] memory) {
        return participants[_tokenId];
    }

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Not the owner");
        _;
    }

    // Receive function to accept ETH
    receive() external payable {}

    // Fallback function to handle ETH sent to the contract
    fallback() external payable {}
}