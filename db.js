const mongoose = require("mongoose");


const connectToMongo = () => {
    mongoose.connect('mongodb+srv://code16:b9OQiqZeVtmvPc2P@amit.6gqztxs.mongodb.net/iNoteBook')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });   
}

module.exports = connectToMongo;