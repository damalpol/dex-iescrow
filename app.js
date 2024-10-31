const express = require("express");
const axios = require("axios");
var cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('./models/user');
const Account = require('./models/account');
const Wallet = require('./models/wallet');
const Coin = require('./models/coin');
const app = express();

// serve your css as static
//app.use(express.static(__dirname));
// get our app to use body parser 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://damalpol:damalpol3.@cluster0.ydk0n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Encryption and decryption functions
const encrypt = (text) => {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decrypt = (encrypted) => {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};


app.listen(8000, () => {
  console.log("DEX iESCROW API started and Listening on port 8000");
});

app.get("/", (req, res) => {
  //console.log(__dirname)	
  //res.set('Cache-Control', 'no-store')
  res.sendFile(__dirname + "/index.html");
});

/// Create user
app.post('/users', async (req, res) => {
    try {
        const { username, email, password, blockchainWalletAddress, privateKey, score, enabled } = req.body;
       
        const hashedPassword = await bcrypt.hash(password, 10);
      
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            blockchainWalletAddress,
            privateKey,
            score,
            enabled,
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read user
app.get('/users/user/:userId', async (req, res) => {
    try {
        const user = await User.find({ _id: req.params.userId });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//TODO Login reset

// Login user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.json({ message: 'Login successful', userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Read all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Create account
app.post('/accounts', async (req, res) => {
    try {
        const { user, name, accountNumber, CBU, alias } = req.body;

        const newAccount = new Account({
            user,
            name,
            accountNumber,
            CBU,
            alias,
        });
        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all accounts for a user
app.get('/accounts/user/:userId', async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.params.userId });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read account details
app.get('/accounts/account/:userId', async (req, res) => {
    try {
        const account = await Account.find({ _id: req.params.userId });
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create wallet
app.post('/wallets', async (req, res) => {
    try {
        const { user, walletAddress, blockchainId, walletAlias } = req.body;

        const newWallet = new Wallet({
            user,
            walletAddress,
            blockchainId,
            walletAlias,
        });
        await newWallet.save();
        res.status(201).json(newWallet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all wallets for a user
app.get('/wallets/user/:userId', async (req, res) => {
    try {
        const wallets = await Wallet.find({ user: req.params.userId });
        res.json(wallets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Create coin
app.post('/coins', async (req, res) => {
    try {
        const { contractAddress, blockchainId, symbol, name, decimals, image } = req.body;

        const newCoin = new Coin({
            contractAddress,
            blockchainId,
            symbol,
            name,
            decimals,
            image,
        });
        await newCoin.save();
        res.status(201).json(newCoin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all tokens for a network ID
app.get('/coins/network/:netId', async (req, res) => {
    try {
        const coins = await Coin.find({ blockchainId: req.params.netId });
        res.json(coins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



