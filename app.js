const pikudHaoref = require('pikud-haoref-api');
const WebSocket = require('ws');

// Use the environment's port or default to 8080
const port = process.env.PORT || 8080;
const interval = 5000; // Polling interval

// Create WebSocket server on dynamic port
const wss = new WebSocket.Server({ port });

console.log(`WebSocket server running on ws://localhost:${port}`);

// Store connected clients
const clients = [];

// Handle new connections
wss.on('connection', ws => {
    console.log('New connection established');
    clients.push(ws);
    ws.send('Welcome to the WebSocket server!');
    ws.on('message', message => {
        console.log('Received:', message);
    });
    ws.on('close', () => {
        const index = clients.indexOf(ws);
        if (index !== -1) clients.splice(index, 1);
        console.log('Connection closed');
    });
});

wss.on('error', error => {
    console.error('Server error:', error);
});

// Function to poll for alerts
const poll = function () {
    const options = {
        alertsHistoryJson: false, // Ensures the key is always present
    };

    pikudHaoref.getActiveAlert((err, alert) => {
        setTimeout(poll, interval); // Schedule the next poll

        if (err) {
            return console.error('Error fetching alert:', err);
        }

        // Log and broadcast the alert
        console.log('Currently active alert:', alert);
        clients.forEach(client => client.send(JSON.stringify(alert)));
    }, options);
};

const sendMockAlert = () => {
    const alert = {
        type: "alert",
        cities: ["אבטליון","אביאל"]
    };
    console.log('Currently active alert:', alert);    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            // Proper UTF-8 encoding
            client.send(Buffer.from(JSON.stringify(alert), 'utf8'));
        }
    });
};

// setInterval(sendMockAlert, 10000);

// Start polling
poll();
// setInterval(sendMockAlert, 10000);  // Send mock alert every 10 seconds
