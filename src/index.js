const http = require('http');
const path = require('path');
const express = require('express');
const socketio  = require('socket.io');

const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

mongoose.connect('mongodb+srv://admin:Anrafu9607@cluster0.el25w.mongodb.net/chat-database?retryWrites=true&w=majority')
.then(db => console.log('db is connected'))
.catch(err => console.log(err));

// settings

app.set('port', process.env.PORT || 3000);

require('./sockets')(io);

// sending static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
server.listen(app.get('port'), () =>{
    console.log('server on port ', app.get('port'));
});


