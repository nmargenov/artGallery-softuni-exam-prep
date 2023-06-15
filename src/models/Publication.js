const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        minLength: [6, 'Title must be atleast 6 characters long!']
    },
    paintingTechnique: {
        type: String,
        required: [true, 'Painting Technique is required!'],
        maxLength: [15, 'Painting Technique must be maximum 15 characters long!']
    },
    artPicture: {
        type: String,
        required: [true, 'Art Picture is required!'],
    },
    cerfiticate: {
        type: String,
        required: [true, 'Cerfiticate is required!'],
        enum: {
            values: ['yes', 'no'],
            message: 'Invalid cerfiticate!'
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    usersSchared:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
});

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;