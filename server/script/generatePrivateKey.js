const { bytesToHex } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp256k1.utils.randomPrivateKey();

const publicKey = secp256k1.getPublicKey(privateKey);

console.log(`Private key: ${bytesToHex(privateKey)}`);

console.log(`Public key: ${bytesToHex(keccak256(publicKey.slice(1)).slice(-20))}`)