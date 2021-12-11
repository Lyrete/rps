//import npm packages
import express from 'express';
import http from 'http';
import fs from 'fs';
import WebSocket from 'ws';

//own imports
import uuid from './helpers/uuid'
import { Socket } from 'socket.io';

import { io } from 'socket.io-client';

//create express app and server
const app = express();
const server = http.createServer(app);

const int_io : Socket = require('socket.io')(server, {cors: {origin: "http://localhost:3002", methods: ["GET", "POST"]}});

//Create both the internal and external websockets connections
const ext_ws = new WebSocket('wss://bad-api-assignment.reaktor.com/rps/live/');

//Create map of clients for the internal ws
const clients = new Map();

int_io.on('connection', (socket: Socket) => {
    const id = uuid();
    console.log(`${id} connected to socket`)
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };
    clients.set(socket, metadata);    
});

ext_ws.on('message', function message(data) {
    const obj = JSON.parse(JSON.parse(data.toString())) //Parse incoming JSON (seems to be double encoded for some reason)    
    obj.t = obj.t || Date.now(); //Add time values to data that is missing it (aka GAME_BEGIN)    
    //console.log(obj); //Log received ws object for debug purposes
    //Send all connected clients the received game's data
    int_io.emit('game', {gamedata: obj})    
});


//serve files from public dir
app.use(express.static(__dirname + '/public'))

//Serve index to client
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//Create server
server.listen(4000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${4000}`);
});