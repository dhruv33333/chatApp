const socket = io();



$('#send-btn').click(function (data) {

    const msgText = $('#inp-msg').val();
    if(msgText == "" || msgText == " ") {
        return;
    }
    const userName = $('#name').val();

     
    socket.emit('send_msg', {
        msg: msgText,   
        user: userName
    });
    $('#inp-msg').val("");

});






socket.on('recieved_msg', (data) => {
    $('#chat').append(`<li> <strong>${data.user}</strong> : ${data.msg}</li>`)
    $("#chat-box").scrollTop($("#chat-box").outerHeight());
});







$('#login-btn').click(function () {
    const user = $('#login-inp').val();

    // console.log(user);
    
    socket.emit('login', {
        user: user
    })

    $('#login-inp').val("");

})