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


module.exports = {
    createPublication,
    getAllPublications
}