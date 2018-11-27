pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract KPC8 is ERC20, ERC20Mintable, ERC20Burnable, Ownable {
    string public name = "KPC8";
    string public symbol = "KPC8";
    uint8 public decimals = 18;
    uint public INITIAL_SUPPLY = 3000000000 * 10 ** uint(decimals);

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
