"use strict";
const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    },
});
io.on('connection', (socket) => {
    console.log(socket.id);
});
http.listen(8080, () => console.log('listening to port 8080.'));
