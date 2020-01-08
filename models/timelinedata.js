const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const timelinedataSchema = mongoose.Schema({
    fullname: {
        type: String,
        required:true
    },
    status: {
        type: String,
        required:true
    },
    time: {
        type: String,
        required:true
        },
    timelineimage:{
        type:String
    }
    });


const TimelineData = mongoose.model('Timeline',timelinedataSchema);
module.exports = TimelineData;


