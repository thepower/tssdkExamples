//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;
contract Greeter {
	string private greeting;

	constructor() {
		greeting = 'Hello World!';
	}

	function greet() public view returns (string memory) {
		return greeting;
	}
	
	function setGreeting(string memory _greeting) public {
		greeting = _greeting;
	}
}