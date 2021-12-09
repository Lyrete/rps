import express from 'express';
import http from 'http';
import bufferify from 'json-bufferify';

const app = express();
const server = http.createServer(app);



import WebSocket from 'ws';

const ws = new WebSocket('wss://bad-api-assignment.reaktor.com/rps/live/');

ws.on('open', function open() {
    console.log('haloo');
})

ws.on('message', function message(data) {
    const obj = JSON.parse(JSON.parse(data.toString()))
    console.log(obj);
})

app.get('/', (req, res) => res.send('Express + TypeScript Server'));
app.listen(4000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${4000}`);
});