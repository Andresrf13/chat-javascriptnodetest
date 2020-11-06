// const e = require("express");
const Chat = require('./models/Chat');

module.exports = function(io){

    let users = {};

    io.on('connection', async socket => {
        console.log('new user connected in sockets.io');

        let messages = await Chat.find({});

        socket.emit('load old msgs', messages);
        
        socket.on('send message', async (data, callback) => {
            
            let msg = data.trim();
            if(msg.substr(0, 3) === '/w '){
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index !== -1) {
                     let name = msg.substr(0, index);
                     msg = msg.substr(index + 1);
                     if(name in users) {
                         users[name].emit('whisper', {
                             msg, nick: socket.nickname
                         });
                     } else {
                         callback('Error! please enter a valid user');
                     }
                } else {
                    callback('Error! please add your message');
                }

            } else {
                const newMsg = new Chat({nick: socket.nickname, msg});
                await newMsg.save();
                io.sockets.emit('new message', {
                    msg: data, nick: socket.nickname
                });
            }
        });

        socket.on('new user', function (data, callback) {
            console.log('new user: ', data);
            if(data in users) {
                callback(false);
            } else {
                socket.nickname = data;
                users[socket.nickname] = socket;
                callback(true);
                updateNicknames();
            }
        });

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        function updateNicknames() {
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
}
