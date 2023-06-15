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
    certificate: {
        type: String,
        required: [true, 'certificate is required!'],
        enum: {
            values: ['yes', 'no'],
            message: 'Invalid certificate! Only \'yes\' and \'no\'!'
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    usersShared:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
});

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;