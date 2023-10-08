// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.7.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.0/utils/Counters.sol"; 

contract SoulBoundTest is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    mapping(address => string) public creds;
    address[] public contracts;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("DeCAT", "DeCAT") {
        creds[0xdC737Bc0B2174a5d4A8CA7b588905c7770C671ee] = "123";
        contracts.push(0x428E1588cD8a3FA448c7539bfDB8354A143FDF09);
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function mintBatch(address[] memory _to, string[] memory _uri) external onlyOwner {
        for (uint256 i = 0; i < _to.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(_to[i], tokenId);
            _setTokenURI(tokenId, _uri[i]);
        }
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // This function is for 2nd Round of Auth
    function setVal(address _new, string memory _password) public {
        creds[_new] = _password;
    }
    function getVal(address _new) public view returns(string memory) {
        return creds[_new];
    }

    // Sould Bound property 
    function _beforeTokenTransfer( address from, address to, uint256 tokenId ) internal override virtual { 
        require(from == address(0), "Err: token transfer is BLOCKED"); super._beforeTokenTransfer(from, to, tokenId);
    }
    
    // Checks if contract is verified
    function verifyContract(address _contract) public view returns(bool) {
        for(uint256 i=0;i<contracts.length;i++){
            if(contracts[i] == _contract){
                return true;
            }
        }
        return false;
    }
}