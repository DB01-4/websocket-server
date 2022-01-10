var express = require('express'); // Get the module
const { Server } = require('ws');
const PORT = process.env.PORT || 8000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));






const wss = new Server({ server });


wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (msg) => {
      console.log('Received Message: ', msg.toString());
      wss.clients.forEach((client) => {
        client.send(msg.toString());
      });
  }) 

  ws.on('close', () => console.log('Client disconnected'));
});

