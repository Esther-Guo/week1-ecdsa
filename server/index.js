const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "09d87cc6157a3d8f79a6946ac89a5ed1ad5b8071cbee3c8e0fb8d389b63b950f": 100,
  "b98169b2d1dd934c4d8ae9ef8f6876e089be7d30edbbda922ed5c5ccebedfa96": 50,
  "7f3f7e2aa3753aaf83f66462b383e367527d1bdc5dbeff782120b0c0a623edd6": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
