import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { bytesToHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const msgHash = bytesToHex(sha256(utf8ToBytes(sendAmount+Date.now()))); // Q:does it matter to put what info in msg? I guess not // A: it matters if we adopt the consensys solution mentioned in readme.
    const signature = secp256k1.sign(msgHash, privateKey);
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        publicKey: bytesToHex(secp256k1.getPublicKey(privateKey)),
        signature: JSON.stringify({
          ...signature,
          r: signature.r.toString(),
          s: signature.s.toString()
        }),
        msgHash,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
