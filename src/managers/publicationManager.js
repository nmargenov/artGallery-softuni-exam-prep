const Publication = require("../models/Publication");
const pattern = /^https?:\/\//;

function createPublication(title, paintingTechnique, artPicture, certificate, author) {
    if (!pattern.test(artPicture)) {
        throw new Error("Invalid art picture!");
    }

    const publication = {
        title,
        paintingTechnique,
        artPicture,
        certificate,
        author
    };

    return Publication.create(publication)
}

function getAllPublications(){
    return Publication.find();
}

function getPublicationById(publicationId){
    return Publication.findById(publicationId).populate('author');
}

function deletePublictionById(publicationId){
    return Publication.findByIdAndDelete(publicationId);
}

function editPublicationById(publicationId,title,paintingTechnique,artPicture,certificate){
    if (!pattern.test(artPicture)) {
        throw new Error("Invalid art picture!");
    }

    const publication = {
        title,
        paintingTechnique,
        artPicture,
        certificate
    };

    return Publication.findByIdAndUpdate(publicationId,publication,{runValidators:true});
}

function sharePublication(publicationId,userId,publication){
    const alreadyShared = checkIfAlreadyShared(publication,userId);
    if(alreadyShared){
        throw new Error('Already shared');
    }
    return Publication.findByIdAndUpdate(publicationId,{$push:{usersShared:userId}});
}

function checkIfAlreadyShared(publication,userId){
    return publication.usersShared.map(u=>u.toString()).includes(userId);
}

module.exports = {
    createPublication,
    getAllPublications,
    getPublicationById,
    deletePublictionById,
    editPublicationById,
    sharePublication,
    checkIfAlreadyShared
}