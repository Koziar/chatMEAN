var mongoose = require('mongoose');

var connection = mongoose.connect('mongodb://admin:mean1111psw@ds013941.mlab.com:13941/mean_lk', function(err){
    if(err){
        console.log("Failed to connect to db! ----- " + err);
    } else {
        console.log("Connected to db!");

    }
});

exports.connection = connection;