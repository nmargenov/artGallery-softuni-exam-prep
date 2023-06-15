const { createPublication, getAllPublications, getPublicationById } = require('../managers/publicationManager');
const { mustBeAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelper');

const router = require('express').Router();

router.get('/gallery',async (req,res)=>{
    try{
        const publications = await getAllPublications().lean();
        const hasPublications = publications.length>0;
        res.status(302).render('tasks/gallery',{publications,hasPublications})
    }catch(err){
        res.status(404).render('404');
    }
});

router.get('/create',mustBeAuth,(req,res)=>{
    res.status(302).render('tasks/create');
});

router.post('/create',mustBeAuth,async(req,res)=>{
    const title = req.body.title?.trim();
    const paintingTechnique = req.body.paintingTechnique?.trim();
    const artPicture = req.body.artPicture?.trim();
    const certificate = req.body.certificate?.trim().toLowerCase();
    const author = req.user._id;

    try{
        await createPublication(title,paintingTechnique,artPicture,certificate,author);
        res.redirect('/posts/gallery');
    }
    catch(err){
        const error = getErrorMessage(err);
        res.status(400).render('tasks/create',{error,title,paintingTechnique,artPicture,certificate})
    }
});

router.get('/:publicationId/details',async(req,res)=>{
    const publicationId = req.params.publicationId;
    const loggedUser = req.user?._id;

    try{
        const publication = await getPublicationById(publicationId).lean();
        if(!publication){
            throw new Error('Invalid publication!');
        }
        res.status(302).render('tasks/details',{publication});
    }catch(err){
        res.status(404).render('404');
    }
});

module.exports = router;