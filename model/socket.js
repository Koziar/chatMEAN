var MsgLog = require('../model/log');

var onlineUsers = [];
var messages = [];


module.exports = function (socket) {

    socket.on('message', function (message) {
        //broadcast('message', message);
        messages.push(message);
        broadcast('allMessages', messages);
        broadcast('userlist', onlineUsers);
        console.log(messages);

        //SAVE TO DB-LOG
        var newMessage = new MsgLog({
            message: message
        });
        // save the message
        newMessage.save(function (err) {
            if (err) {
                throw(err);
                console.log(err)
            } else {
                console.log("Message logged in db!")
            }
        });
        //LOG END

    });

    socket.on('newuser', function (user) {

        //broadcast('newuser', user);
        onlineUsers.push(user);
        //broadcast('message', datetime + " - " + user + " logged on!");
        broadcast('userlist', onlineUsers);
        console.log("USERS: " + onlineUsers);
    });

    socket.on('logout', function (user) {

        //broadcast('message', datetime + " - " + user + " logged out!");
        onlineUsers.splice(onlineUsers.indexOf(user), 1);
        //onlineUsers.remove(user);
        broadcast('userlist', onlineUsers);
        console.log("USERS: " + onlineUsers);
    });

    function broadcast(type, payload) {
        socket.broadcast.emit(type, payload);
        socket.emit(type, payload);
    }


};
