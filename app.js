const pikudHaoref = require('pikud-haoref-api');
const WebSocket = require('ws');

// Use the environment's port or default to 8080
const port = process.env.PORT || 8080;
const interval = 5000; // Polling interval
const proxies = [
    'http://62.219.20.3:8111',     // QvQust Yavne
    'http://77.137.39.241:19000',  // Sderot
    'http://199.203.152.99:8111'   // Tel Aviv
];

let currentProxyIndex = 0;

// Create WebSocket server
const wss = new WebSocket.Server({ port });
console.log(`WebSocket server running on ws://localhost:${port}`);

// Store connected clients
const clients = [];

wss.on('connection', ws => {
    console.log('New connection established');
    clients.push(ws);
    ws.send('Welcome to the WebSocket server!');
    ws.on('close', () => {
        const index = clients.indexOf(ws);
        if (index !== -1) clients.splice(index, 1);
        console.log('Connection closed');
    });
});

wss.on('error', error => {
    console.error('Server error:', error);
});

// Polling function with fallback proxy support
const poll = () => {
    const currentProxy = proxies[currentProxyIndex];
    const options = {
        alertsHistoryJson: false,
        proxy: currentProxy
    };

    pikudHaoref.getActiveAlert((err, alert) => {
        setTimeout(poll, interval); // Schedule next poll

        if (err) {
            console.error(`Error with proxy ${currentProxy}:`, err.message || err);
            // Try next proxy
            currentProxyIndex = (currentProxyIndex + 1) % proxies.length;
            return;
        }

        console.log('Currently active alert:', alert);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(Buffer.from(JSON.stringify(alert), 'utf8'));
            }
        });
    }, options);
};

// Start polling
poll();
