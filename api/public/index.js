import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

(async function() {

    const socket = io();  

    socket.on('game', (msg) => {
        if(msg.gamedata){
            if(msg.gamedata.type == 'GAME_BEGIN'){
                createGame(msg);
            }else if(msg.gamedata.type == 'GAME_RESULT'){
                resolveGame(msg);
            }
            
        }
    });
    
    
    document.body.onmousemove = (evt) => {
        const messageBody = { x: evt.clientX, y: evt.clientY };
        socket.send(JSON.stringify(messageBody));
    };        

    function createGame(messageBody) {
        const data = messageBody.gamedata;
        const game = document.createElement("div");
        game.id = data.gameId;
        game.innerHTML = `${data.type}: ${data.playerA.name} vs ${data.playerB.name}`;

        const container = document.getElementById('container');
        container.appendChild(game);
    }

    function resolveGame(messageBody) {
        const data = messageBody.gamedata;
        const game = document.getElementById(data.gameId);

        if(!game){return false}
        const node = document.createTextNode(` - Played moves: ${data.playerA.played} vs ${data.playerB.played}`);

        game.appendChild(node);

        setTimeout(function(){
             game.remove();
        }, 5000);
    }

})();