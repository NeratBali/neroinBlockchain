const Blockchain = require("./blockChain");
const neroin = new Blockchain();
const uuid = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const nodeAddress = uuid.v1().split("-").join("");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // Allow cross-origin requests

// GET Blockchain
app.get("/blockchain", (req, res) => {
    res.json(neroin);
});

// POST Create Transaction
app.post("/transaction", (req, res) => {
    const { amount, sender, recipient } = req.body;

    if (!amount || !sender || !recipient) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const blockIndex = neroin.createNewTransaction(amount, sender, recipient);
    res.json({
        note: `Transaction will be added in block `,
        blockIndex:blockIndex,
    });
});

// GET Mine Block
app.get("/mine", (req, res) => {
    const lastBlock = neroin.getLastBlock();
    const previousBlockHash = lastBlock.hash;
    const currentBlockData = {
        transactions: neroin.pendingTransactions,
        index: lastBlock.index + 1,
    };

    const nonce = neroin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = neroin.hashBlock(previousBlockHash, currentBlockData, nonce);

    // Reward for mining
    neroin.createNewTransaction(12.5, "00", nodeAddress);

    const newBlock = neroin.createNewBlock(nonce, previousBlockHash, blockHash);
    const sensitiveKeys=['nonce', 'hash', 'previousBlockHash'];
    sensitiveKeys.forEach(key=>delete newBlock[key]);
    res.json({
        note: "New block mined successfully.",
        block: newBlock,
    });
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on port 3000...");
});
