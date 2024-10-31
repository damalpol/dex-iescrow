// models/wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    walletAddress: { type: String, required: true, unique: true },
    blockchainId: { type: String, required: true },
    walletAlias: { type: String, required: true },
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;