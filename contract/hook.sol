// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { ISPHook } from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import {Groth16Verifier} from "./verifier.sol";

// @dev This contract manages the whitelist. We are separating the whitelist logic from the hook to make things easier
// to read.
contract WhitelistMananger is Groth16Verifier, Ownable {
    error IneligibleAttestation();

    constructor() Ownable(_msgSender()) { }

    function _checkCanAttest(bytes calldata data) internal view {
        (uint[2] memory _a, uint[2][2] memory _b, uint[2] memory _c, uint[2] memory pubSignals) = abi.decode(data, (uint[2], uint[2][2], uint[2], uint[2]));
        if(!verifyProof(_a,_b,_c,pubSignals)) revert IneligibleAttestation();
    }
}

// @dev This contract implements the actual schema hook.
contract WhitelistHook is ISPHook, WhitelistMananger {
    function didReceiveAttestation(
        address, // attester
        uint64, // schemaId
        uint64, // attestationId
        bytes calldata data // extraData is proof
    )
        external
        payable
    {
        _checkCanAttest(data);
    }

    function didReceiveAttestation(
        address, // attester
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata data// extraData
    )
        external
        view
    {
        _checkCanAttest(data);
    }

    function didReceiveRevocation(
        address attester, // attester
        uint64, // schemaId
        uint64, // attestationId
        bytes calldata // extraData
    )
        external
        payable
        onlyOwner()
    {
        
    }

    function didReceiveRevocation(
        address attester, // attester
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    )
        external
        view
        onlyOwner()
    {
    }
}