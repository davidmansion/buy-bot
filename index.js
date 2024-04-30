const TelegramBot = require('node-telegram-bot-api');
const { BncClient } = require('@binance-chain/javascript-sdk');

// Initialize your Telegram bot
const botToken = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(botToken, { polling: true });

// Initialize Binance Smart Chain client
const client = new BncClient('https://bsc-dataseed1.binance.org:443');

// Set the token contract address you want to monitor
const contractAddress = 'YOUR_CONTRACT_ADDRESS';

// Function to send notifications to users
function sendNotification(chatId, message) {
    bot.sendMessage(chatId, message);
}

// Listen for incoming transactions
async function listenForTransactions() {
    const result = await client.getTransactions(contractAddress);
    result.result.forEach(tx => {
        const { value, txHash } = tx;
        // Implement your own logic to check if it's a buy or sell transaction
        // For example, you can check the value or other parameters of the transaction
        if (value > 0) {
            sendNotification(chatId, `Buy transaction detected: https://bscscan.com/tx/${txHash}`);
        } else {
            sendNotification(chatId, `Sell transaction detected: https://bscscan.com/tx/${txHash}`);
        }
    });
}

// Listen for Telegram commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Bot started! You will receive notifications for buy/sell transactions of the token.");
});

// Start listening for transactions
listenForTransactions();
