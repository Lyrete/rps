(async function() {

    const ws = await connectToServer();    

    ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        if(messageBody.gamedata){
            if(messageBody.gamedata.type == 'GAME_BEGIN'){
                createGame(messageBody);
            }else if(messageBody.gamedata.type == 'GAME_RESULT'){
                resolveGame(messageBody);
            }
            
        }
        const cursor = getOrCreateCursorFor(messageBody);
        cursor.style.transform = `translate(${messageBody.x}px, ${messageBody.y}px)`;
    };        
    
    document.body.onmousemove = (evt) => {
        const messageBody = { x: evt.clientX, y: evt.clientY };
        ws.send(JSON.stringify(messageBody));
    };
        
    async function connectToServer() {    
        const ws = new WebSocket('ws://localhost:8080/');
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if(ws.readyState === 1) {
                    clearInterval(timer);
                    resolve(ws);
                }
            }, 10);
        });   
    }

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

        // setTimeout(function(){
        //     game.remove();
        // }, 5000);
    }

    function getOrCreateCursorFor(messageBody) {
        const sender = messageBody.sender;
        const existing = document.querySelector(`[data-sender='${sender}']`);
        if (existing) {
            return existing;
        }
        
        const template = document.getElementById('cursor');
        const cursor = template.content.firstElementChild.cloneNode(true);
        const svgPath = cursor.getElementsByTagName('path')[0];    
            
        cursor.setAttribute("data-sender", sender);
        svgPath.setAttribute('fill', `hsl(${messageBody.color}, 50%, 50%)`);    
        document.body.appendChild(cursor);

        return cursor;
    }

})();