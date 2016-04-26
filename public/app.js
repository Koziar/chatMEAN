angular.module('meanchat', [])

    .service('socket', function ($rootScope) {
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    })

    .filter("reverseFilter", function () {
        return function (items) {
            return items.slice().reverse(); // Create a copy of the array and reverse the order of the items
        };
    })

    .controller('mainController', ['socket', '$window', '$location', function (socket, $window, $location) {

        var scope = this;

        scope.messages = [];

        scope.onlineusers = [];

        scope.sendDisabled = true;

        scope.haveChosenUsername = false;

        scope.loggedOut = false;

        scope.showLogout = false;

        scope.showUsersAndTextInput = false;

        var thisUser;

        if ($window.localStorage.username) {
            thisUser = $window.localStorage.username;
            scope.haveChosenUsername = true;
            scope.loggedOut = false;
            scope.sendDisabled = false;
            scope.showLogout = true;
            scope.showUsersAndTextInput = true;
            socket.emit('message', thisUser + " is back!");
        }


        scope.newuser = function () {

            $window.localStorage.username = scope.usernameInput;
            socket.emit('newuser', scope.usernameInput);
            thisUser = scope.usernameInput;
            socket.emit('message', scope.usernameInput + " logged on!");

            scope.haveChosenUsername = true;
            scope.loggedOut = false;
            scope.sendDisabled = false;
            scope.showLogout = true;
            scope.showUsersAndTextInput = true;
        };

        scope.logout = function () {
            socket.emit('logout', thisUser);
            scope.loggedOut = true;
            socket.emit('message', thisUser + " logged out!");
            $window.localStorage.removeItem('username');
            $location.path('/');
            scope.haveChosenUsername = false;
            scope.showUsersAndTextInput = false;
        };

        //Sending message
        scope.sendMessage = function () {

            var currentdate = new Date();
            var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth() + 1) + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

            var messageWithUser = datetime + " - " + thisUser + " said: " + scope.messageInput;

            socket.emit('message', messageWithUser); //Sends to server, and stores it in an array
            scope.messageInput = '';
        };


        socket.on('allMessages', function (messages) {
            scope.messages = messages;
            console.log("MESSAGES: " + scope.messages);
        });


        socket.on('userlist', function (users) {
            scope.onlineusers = users;
            console.log("USERLIST: " + scope.onlineusers);
        });

        //When a new user joins, it will broadcast it to all users.
        socket.on('newuser', function (usernameInput) {

        });

    }]);
