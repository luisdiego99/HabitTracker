const mongoose = require('mongoose');
const habitSchema = new mongoose.Schema({
    title:{
        type: String,
        requiered: true
    },
    description:{
        type: String,
        requiered: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    days:{
        type:Number,
        default: 1
    },
    lastDone:{
        type: Date,
        default: Date.now
    },
    lastUpdate:{
        type: Date,
        default:Date.now
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Habit', habitSchema);