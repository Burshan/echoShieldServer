const WebSocket = require('ws');
const fs = require('fs');

const port = 8080;
const wss = new WebSocket.Server({ port, host: '0.0.0.0' });

console.log(`📡 Mock server on ws://localhost:${port}`);

let clients = [];
let counter = 0;
const mockEveryN = 10; // send real alert every N messages

wss.on('connection', (ws) => {
    console.log('👥 New client connected');
    clients.push(ws);

    ws.send('Welcome to EchoShield Test Server');

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('❌ Client disconnected');
    });
});

// Load mock alert once from file
const mockAlert = JSON.parse(fs.readFileSync('yemen.json', 'utf8'));

// Broadcast every 5 seconds
setInterval(() => {
    counter++;

    const message = (counter % mockEveryN === 0)
        ? mockAlert
        : { type: "none", cities: [] };

    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });

    console.log(`📤 Sent ${message.type} (${counter})`);
}, 5000);
