//import npm packages
import express from 'express';
import http from 'http';
import fs from 'fs';
import WebSocket from 'ws';

//own imports
import uuid from './helpers/uuid'

//Create both the internal and external websockets connections
const ext_ws = new WebSocket('wss://bad-api-assignment.reaktor.com/rps/live/');
const int_ws = new WebSocket.Server({
    port: 8080
});

//Create map of clients for the internal ws
const clients = new Map();

int_ws.on('connection', (ws: WebSocket) => {    
    const id = uuid();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };
    clients.set(ws, metadata);

    ws.on('message', (msg) => {
        //Fuctions for when:
        //A client needs to receive info when another client needs something
    });

    //Close connection to client when they close their browser
    ws.on('close', () => {
        console.log(`Closed connection to ${id}`)
        clients.delete(ws);
    });
});

ext_ws.on('message', function message(data) {
    const obj = JSON.parse(JSON.parse(data.toString())) //Parse incoming JSON (seems to be double encoded for some reason)
    
    obj.t = obj.t || Date.now(); //Add time values to data that is missing it (aka GAME_BEGIN)
    
    //console.log(obj); //Log received ws object for debug purposes

    //Send all connected clients the received game's data
    [...clients.keys()].forEach((client) => {
        client.send(JSON.stringify({sender: 'server', gamedata: obj}));
    });    
});

//create express app and server
const app = express();
const server = http.createServer(app);

//serve files from public dir
app.use(express.static('public'))

//Serve index to client
app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type':'text/html'});
    const html = fs.readFileSync('index.html');
    res.end(html);
});

//Create server
app.listen(4000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${4000}`);
});