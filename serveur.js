const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const session = require("express-session");
const bcrypt = require("bcrypt");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

// ===== SERIAL =====
const serialPort = new SerialPort({
  path: "COM3",
  baudRate: 9600
});

const parser = serialPort.pipe(
  new ReadlineParser({ delimiter: "\n" })
);

let lastData = {
  distance: 0,
  temperature: 0,
  humidite: 0
};

parser.on("data", line => {
  try {
    const data = JSON.parse(line.trim());
    lastData = data;
    console.log("Capteur →", data);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });

  } catch (err) {
    console.warn("Donnée invalide :", line);
  }
});

wss.on("connection", (ws) => {
  console.log("Client Web connecté");
  ws.send(JSON.stringify(lastData));
});


server.listen(3000, "0.0.0.0", () => {
  console.log("Serveur web accessible sur le réseau local");
});


app.get("/monitoring", (req, res) => {
  res.sendFile(__dirname + "/public/interface.html");
});

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "cle-secrete-plateforme",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000 // 30 minutes
    }
  })
);

// Mot de passe (hashé)
const PASSWORD_HASH = bcrypt.hashSync("admin123", 10);

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.post("/login", express.urlencoded({ extended: true }), async (req, res) => {
  const { password } = req.body;

  const ok = await bcrypt.compare(password, PASSWORD_HASH);

  if (ok) {
    req.session.auth = true;
    res.redirect("/monitoring");
  } else {
    res.send("Mot de passe incorrect ❌");
  }
});

function authRequired(req, res, next) {
  if (req.session.auth) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});




