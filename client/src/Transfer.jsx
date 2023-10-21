import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const msgHash = sha256(utf8ToBytes(sendAmount));
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        // sender: privateKey,
        signature: secp256k1.sign(msgHash, privateKey), // TypeError: Do not know how to serialize a BigInt
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
