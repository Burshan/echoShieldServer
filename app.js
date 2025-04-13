const pikudHaoref = require('pikud-haoref-api');
const WebSocket = require('ws');

// Use the environment's port or default to 8080
const port = process.env.PORT || 8080;
const interval = 5000; // Polling interval

// Create WebSocket server on dynamic port
const wss = new WebSocket.Server({ port, host: '0.0.0.0' });

console.log(`WebSocket server running on ws://0.0.0.0:${port}`);

// console.log(`WebSocket server running on ws://localhost:${port}`);

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
    const alert ={
        "type": "missiles",
        "cities": [
          "תל אביב - מרכז העיר",
          "תל אביב - מזרח",
          "תל אביב - עבר הירקון",
          "בת ים",
          "גבעתיים",
          "רמת גן - מערב",
          "רמת גן - מזרח",
          "ראשון לציון - מערב",
          "ראשון לציון - מזרח",
          "רחובות",
          "רמלה",
          "רמת השרון",
          "כפר סבא",
          "הרצליה - מערב",
          "הרצליה - מרכז וגליל ים",
          "נס ציונה",
          "פתח תקווה",
          "חולון",
          "יהוד מונוסון",
          "בני ברק",
          "אלעד",
          "אור יהודה",
          "סביון",
          "קריית אונו",
          "מבשרת ציון",
          "מעלה החמישה",
          "ירושלים - מערב",
          "ירושלים - דרום",
          "ירושלים - צפון",
          "ירושלים - מזרח",
          "אריאל",
          "מודיעין",
          "שוהם",
          "אזור",
          "גבעת שמואל",
          "מוצא עילית",
          "בית זית",
          "בית נקופה",
          "נווה ימין",
          "נווה ירק",
          "גן שורק",
          "פלמחים",
          "חגור",
          "כפר קאסם",
          "כפר ברא",
          "נירית",
          "נופך",
          "בני עטרות",
          "נצר סרני",
          "כפר שמריהו",
          "אלישמע",
          "עדנים",
          "עינת",
          "עיינות",
          "צופית",
          "רמות השבים",
          "גני תקווה",
          "גני עם",
          "גן חיים",
          "מתן",
          "מזור",
          "מגשימים",
          "באר יעקב",
          "בארות יצחק",
          "חולדה",
          "נחשונים",
          "נחלים",
          "ירחיב",
          "ישרש",
          "עטרות",
          "שדה ורבורג",
          "גבעת השלושה",
          "גת רימון",
          "מעש",
          "אורנית",
          "אירוס",
          "תעוז",
          "צובה",
          "קריית ענבים",
          "הוד השרון",
          "תל מונד",
          "כפר מל''ל",
          "חפץ חיים",
          "גיבתון",
          "בית עובד",
          "בית חנן",
          "קיבוץ גזר",
          "הראל",
          "שעלבים",
          "לפיד",
          "כפר סירקין",
          "ניר צבי",
          "מקווה ישראל",
          "כפר טרומן",
          "בית חורון",
          "כפר אוריה",
          "אבן יהודה",
          "שמשית",
          "זיתן",
          "בית דגן",
          "שלווה",
          "גן שלמה",
          "אחיסמך",
          "ברקת",
          "עדי",
          "כפר ידידיה",
          "בני ציון",
          "בית יהושע",
          "תל יצחק",
          "חבצלת השרון",
          "בית ינאי",
          "עין ורד",
          "כפר נטר",
          "נתניה - דרום",
          "נתניה - מזרח",
          "נתניה - צפון",
          "עין שריד",
          "שפיים",
          "כפר יונה",
          "פרדסיה",
          "כפר הס",
          "כפר חיים",
          "בית חפר",
          "נורדיה",
          "בית אלעזרי",
          "כפר הרא״ה",
          "גאולים",
          "תל יצחק",
          "אודים",
          "בית ינאי",
          "אלישיב",
          "בית יצחק",
          "הדר עם",
          "משמר השרון",
          "בית הלוי",
          "בת חפר",
          "גבעת חיים",
          "ביתן אהרון",
          "כפר ויתקין",
          "מכמורת",
          "מעגן מיכאל",
          "קיסריה",
          "שפיים",
          "געש",
          "רשפון",
          "שדות ים",
          "שושנת העמקים"
        ],
        "instructions": "היכנסו למרחב המוגן ושהו בו 10 דקות"
      };
    console.log('Currently active alert:', alert);    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            // Proper UTF-8 encoding
            client.send(Buffer.from(JSON.stringify(alert), 'utf8'));
        }
    });
};

// setInterval(sendMockAlert, 5000);

// Start polling
// poll();
setInterval(sendMockAlert, 10000);  // Send mock alert every 10 seconds
