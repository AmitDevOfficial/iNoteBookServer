const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema ({
    //we can display the notes only who's user then they are created--
    //Notes are not be shown in the diffrent user--
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    }
})

module.exports = mongoose.model("notes", NotesSchema);