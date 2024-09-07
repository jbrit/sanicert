# Sanicert

Sanicert is a private, permissionless medical data attestation protocol built with the Sign Protocol. It provides a secure and privacy-preserving system for managing and verifying sensitive medical information using blockchain technology and zero-knowledge proofs.

## Features

- Integration with Base Sepolia testnet
- Zero-Knowledge Proof generation and verification
- On-chain attestation creation
- Custom circom circuits for various verifications (e.g., age, vaccination status)
- User-friendly interface for patients and verifiers

## Tech Stack

- Next.js for the frontend framework
- RainbowKit for wallet connection
- Wagmi for Ethereum interactions
- Circom for circuit design
- Snarkjs for proof generation and verification
- Circomlibjs for cryptographic operations (EdDSA signatures)
- Solidity smart contracts for on-chain verification
- Sign Protocol (@ethsign/sp-sdk) for creating attestations

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
yarn init
```
3. Run the development server:
```bash
yarn dev
```

4. Open <http://localhost:3000> with your browser to see the result.



The project follows a standard Next.js structure with additional directories for circuits and contracts.


## Key Components

1. Patient Information Management
2. Proof Generation
3. Verifier Interface
4. Sample Circom Circuits:
   - Age verification: `examples/legal.circom`
   - Vaccination status: `examples/vaccinated.circom`
5. Sample Smart Contract for Verification:
   - `contract/verifier.sol`


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

[jibola](https://github.com/jbrit/)

## Acknowledgements

- [Sign Protocol](https://www.sign.global/)
- [Circom](https://docs.circom.io/)
- [Snarkjs](https://github.com/iden3/snarkjs)
- [Next.js](https://nextjs.org/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Wagmi](https://wagmi.sh/)

For more information on how Sanicert works and its components, please refer to the individual files and comments within the codebase.