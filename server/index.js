const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { hexToBytes } = require("ethereum-cryptography/utils");


app.use(cors());
app.use(express.json());

const balances = {
  // 09d87cc6157a3d8f79a6946ac89a5ed1ad5b8071cbee3c8e0fb8d389b63b950f
  "04c41529f22855b063ed38021ce084ac30ff5745": 100,
  // b98169b2d1dd934c4d8ae9ef8f6876e089be7d30edbbda922ed5c5ccebedfa96
  "323905b1346b22148cbeda5baf041ee2d698c997": 50,
  // 7f3f7e2aa3753aaf83f66462b383e367527d1bdc5dbeff782120b0c0a623edd6
  "6427cce8b55e73c229a5e30bc82539738e076e10": 75,
};

// fa15dbeea912a3ccd076284746c5f9459324ccfa1a7c958be9fc5db0b7b8eafc
// 2e8236fe0af9eed2790e8473de33f522cfd99f29

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, publicKey, signature, msgHash, recipient, amount } = req.body;

  // recover original signature
  const sigObj = JSON.parse(signature);
  const recoverSig = new secp256k1.Signature(BigInt(sigObj.r), BigInt(sigObj.s), sigObj.recovery);

  // console.log(secp256k1.verify(recoverSig, msgHash, hexToBytes(publicKey)));

  if (!secp256k1.verify(recoverSig, msgHash, hexToBytes(publicKey))) res.status(400).send({ message: "Verification failed!" });
  else {
    setInitialBalance(sender);
    setInitialBalance(recipient);
  
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
