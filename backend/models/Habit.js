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
    lastDone:{
        type: Date,
        default: Date.now
    },
    days:{
        type:Number,
        default: 1
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Habit', habitSchema);