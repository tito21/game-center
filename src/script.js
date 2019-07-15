const ipcRenderer = require('electron').ipcRenderer;

const sendLoadMssg = (ev) => {
    console.log(ev.target.id);
    ipcRenderer.send('load-game', ev.target.id);

};

ipcRenderer.on('game-list', (event, games) => {
    console.log(games);
    list = document.getElementById("game-list");
    for ([id, game] of Object.entries(games)) {
        // game = JSON.parse(g);
        let li = document.createElement("li");
        let box = document.createElement("div");
        box.className = "game-box"
        box.id = id;
        box.innerHTML = "<p>"+game.productName+"</p>";
        li.appendChild(box);
        list.appendChild(li);
        li.addEventListener('click', sendLoadMssg);
    }
});
