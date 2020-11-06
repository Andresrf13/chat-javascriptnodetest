$(function(){
    const socket = io();

    // obtaining DOM element from UI
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // obtening DOM elements from nicknameForm
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickName = $('#nickName');

    // obtening DOM elements from usernames

    const $users = $('#usernames');

    $nickForm.submit( e => {
        e.preventDefault();
        console.log('enviando...');
        socket.emit('new user', $nickName.val(), data => {
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`<div class='alert alert-danger'>
                that username already exits</div>`);
            }
            $nickName.val('');
        });
    });

    // events

    $messageForm.submit( e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error"> ${data} </p>`);
        });
        $messageBox.val('');
    });

    socket.on('new message', function(data) {
        displayMsg(data);
    });

    socket.on('usernames', function(data) {
        let html  = '';
        for (let i=0; i <data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;   
        }
        $users.html(html);
    });

    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}`);
    })

    socket.on('load old msgs', data =>{
        for (let i = 0; i < data.length; i++) {
            displayMsg (data[i]);
            
        }
    });

    function displayMsg(data) {
        $chat.append('<b>'+data.nick+'</b>  ' + data.msg + '<br>');
    }
})
