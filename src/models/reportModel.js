const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    PostID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    Reason: {
        type: String,
    },
    Status: {
        type: String,
        default: 'Pending',
    },
    Action: {
      type:String  
    },
    AdminID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

}, {
    timestamps: true,
})



const Report = mongoose.model('Report', reportSchema);
module.exports = Report;