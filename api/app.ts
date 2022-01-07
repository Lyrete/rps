//import npm packages
import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { Socket } from 'socket.io';
import fetch from 'node-fetch';

//own imports
import uuid from './helpers/uuid'
import { connectToDatabase, getHistory, insertToDb } from './helpers/database';
import { IGame } from './helpers/models/game';

//create express app and server
const app = express();
const server = http.createServer(app);

//Create the socket for our frontend
const int_io : Socket = require('socket.io')(server, {cors: {origin: "http://localhost:3000", methods: ["GET", "POST"]}});

//connect to the external ws
const ext_ws = new WebSocket('wss://bad-api-assignment.reaktor.com/rps/live/');

//Create map of clients for the internal ws
const clients = new Map();
const recent: Map<string, IGame> = new Map();

int_io.on('connection', async (socket: Socket) => {
    const id = uuid();
    console.log(`${id} connected to socket`);
    getHistory().then(res => socket.emit('history', res));
    socket.emit('recent', [...recent.entries()]); //Send the events on the server over
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };
    clients.set(socket, metadata);
});

ext_ws.on('message', function message(data) {
    const obj = JSON.parse(JSON.parse(data.toString())) //Parse incoming JSON (seems to be double encoded for some reason)    
    obj.t = obj.t || Date.now(); //Add time values to data that is missing it (aka GAME_BEGIN)    
    //console.log(obj); //Log received ws object for debug purposes
    recent.set(obj.gameId, obj); //Set the incoming game in our recent games
    if(recent.size > 10){
        const keyToRemove: string = recent.keys().next().value;
        const gameToRemove = recent.get(keyToRemove);
        if(gameToRemove){insertToDb([gameToRemove])} //Insert the game to db when we don't store it locally anymore
        recent.delete(keyToRemove); //remove first element
        console.log('Shortened recent')
    }
    //Send all connected clients the received game's data
    int_io.emit('game', {gamedata: obj})    
});

interface APIResponse{
    cursor: string,
    data: Array<IGame>
}

//serve files from public dir
app.use(express.static(__dirname + '/public'))

app.get('/populatedata', async (req, res) => {
    const url: string = 'https://bad-api-assignment.reaktor.com';
    let cursor: string = '/rps/history';

    while(cursor){        
        const response: APIResponse = await fetch(url + cursor).then(res => res.json());
        cursor = response.cursor
        if(response.data.length > 0){
            await insertToDb(response.data);
        }        
    }

    console.log('db populated');
    res.send('Database populated');
})

//Serve index to client
app.get('/', (req, res) => {
    
    res.sendFile(__dirname + '/index.html');
});

//Create server
connectToDatabase().then(() => {
    server.listen(4000, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${4000}`);
      });
}
);
