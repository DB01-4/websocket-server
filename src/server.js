const webSocketsServerPort = 8000;
const webSocketsServer = require('websocket').server;
const http = require('http');
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(webSocketsServerPort, () => console.log(`Listening on ${webSocketsServerPort}`));



//const server = http.createServer();
//server.listen(webSocketsServerPort);

//console.log('listening on port ' + webSocketsServerPort);

const wsServer = new webSocketsServer({ server });



const clients = {};

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + 'Received a new connection from origin ' + request.origin);

    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ', message.utf8Data);

            for(const key in clients) {
                clients[key].sendUTF(message.utf8Data);
                console.log('sent Message to: ', clients[key])
            }
        }
    })
})