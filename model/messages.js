var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  content: String,
  date: {
        type: Date,
        default: Date.now
      },
  username: String,
  room: String      

    });
