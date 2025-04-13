const fs = require('fs');
const WebSocket = require('ws');
const path = require('path');

// Load the full alert JSON (from your saved file)
const fullAlertPath = path.join(__dirname, 'yemen.json');
const fullAlert = JSON.parse(fs.readFileSync(fullAlertPath, 'utf8'));

// Empty alert
const emptyAlert = {
  type: 'none',
  cities: []
};

// WebSocket server setup
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port, host: '0.0.0.0' });
console.log(`WebSocket mock server running on ws://0.0.0.0:${port}`);

let clients = [];
let counter = 0;

wss.on('connection', ws => {
    console.log('🎧 New connection');
    clients.push(ws);

    ws.on('close', () => {
        clients = clients.filter(c => c !== ws);
        console.log('❌ Connection closed');
    });
});

// Broadcast every 10 seconds: 5 full alerts, then 5 empty
setInterval(() => {
    const message = (counter < 5) ? fullAlert : emptyAlert;

    console.log(`📤 Sending alert #${counter + 1}: ${message.type}, cities: ${message.cities.length}`);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });

    counter = (counter + 1) % 10;
}, 10_000);
