import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { bytesToHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const publicKey = secp256k1.getPublicKey(privateKey);
    const curAddress = bytesToHex(keccak256(publicKey.slice(1)).slice(-20))
    setAddress(curAddress);

    if (privateKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${curAddress}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input placeholder="Type private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="address">Address: {address}</div>


      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
