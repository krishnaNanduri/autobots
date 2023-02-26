const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require("socket.io");

const chatAI = require("./dialogflow");
const detectIntent = require("./dialogflow-fulfillment");

const loads = require('./loads.json');

const port = 8080;

const app = express();
const server = createServer(app);

const sessionMiddleware = session({
  secret: "autobots",
  resave: false,
  saveUninitialized: false
});

app.use(sessionMiddleware);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
  const sessionId = socket.request.session.id;
  socket.join(sessionId);
  console.log(sessionId);

  socket.on("to_bot", async (message) => {
    console.log(message);
    const reply = await chatAI(sessionId, message.message);
    console.log(reply);
    socket.emit("from_bot", { message: reply })
  })
});

function test(sessionId, query) {
  console.log(query, sessionId);
  return "HI, How are you doing";
}

app.post("/login", (req, res) => {
  req.session.authenticated = true;
  res.status(204).end();
});

app.post("/logout", (req, res) => {
  const sessionId = req.session.id;

  req.session.destroy(() => {
    io.in(sessionId).disconnectSockets();
    res.status(204).end();
  });
});

app.post('/webhook', async (req, res) => {
  console.log('webhook endpoint hit');
  await detectIntent(req, res);
})

app.post('/chat', async (req, res) => {
  const query = req.body.message;
  const output = await test(req.sessionID, query);
  res.status(200).json({
    message: output
  })
});

app.get('/loads', (req, res) => {
  res.status(200).json(loads);
});


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})