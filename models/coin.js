// models/coin.js
const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
    contractAddress: { type: String, required: true, unique: true },
    blockchainId: { type: String, required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    decimals: { type: Number, required: true }, 
    image: { type: String, required: false },
});

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;