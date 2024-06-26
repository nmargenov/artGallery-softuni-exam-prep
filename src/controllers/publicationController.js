const { createPublication, getAllPublications, getPublicationById, deletePublictionById, editPublicationById, sharePublication, checkIfAlreadyShared } = require('../managers/publicationManager');
const { addPublicationToUser, removePublictionFromUser } = require('../managers/userManager');
const { mustBeAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelper');

const router = require('express').Router();

router.get('/gallery', async (req, res) => {
    try {
        const publications = await getAllPublications().lean();
        const hasPublications = publications.length > 0;
        res.status(302).render('tasks/gallery', { publications, hasPublications })
    } catch (err) {
        res.status(404).render('404');
    }
});

router.get('/create', mustBeAuth, (req, res) => {
    res.status(302).render('tasks/create');
});

router.post('/create', mustBeAuth, async (req, res) => {
    const title = req.body.title?.trim();
    const paintingTechnique = req.body.paintingTechnique?.trim();
    const artPicture = req.body.artPicture?.trim();
    const certificate = req.body.certificate?.trim().toLowerCase();
    const author = req.user._id;

    try {
        const publication = await createPublication(title, paintingTechnique, artPicture, certificate, author);
        await addPublicationToUser(author,publication._id);
        res.redirect('/posts/gallery');
    }
    catch (err) {
        const error = getErrorMessage(err);
        res.status(400).render('tasks/create', { error, title, paintingTechnique, artPicture, certificate })
    }
});

router.get('/:publicationId/details', async (req, res) => {
    const publicationId = req.params.publicationId;
    const loggedUser = req.user?._id;

    try {
        const publication = await getPublicationById(publicationId).lean();
        const isOwner = publication.author._id == loggedUser;
        const hasShared = loggedUser && checkIfAlreadyShared(publication,loggedUser);
        if (!publication) {
            throw new Error('Invalid publication!');
        }
        res.status(302).render('tasks/details', { publication,isOwner,hasShared });
    } catch (err) {
        res.status(404).render('404');
    }
});

router.get('/:publicationId/delete', mustBeAuth, async (req, res) => {
    const publicationId = req.params.publicationId;
    const loggedUser = req.user._id;

    try {
        const publication = await getPublicationById(publicationId);
        if (!publication || publication.author._id != loggedUser) {
            throw new Error('Bad request!');
        }
        await deletePublictionById(publicationId);
        await removePublictionFromUser(loggedUser,publicationId);
        res.redirect('/posts/gallery');
    } catch (err) {
        res.status(404).render('404');
    }
});

router.get('/:publicationId/edit', mustBeAuth, async (req, res) => {
    const publicationId = req.params.publicationId;
    const loggedUser = req.user._id;

    try {
        const publication = await getPublicationById(publicationId).lean();
        if (!publication || publication.author._id != loggedUser) {
            throw new Error('Bad request!');
        }
        res.status(302).render('tasks/edit', { publication });
    } catch (err) {
        res.status(404).render('404');
    }
});

router.post('/:publicationId/edit', mustBeAuth, async (req, res) => {
    const publicationId = req.params.publicationId;
    const loggedUser = req.user._id;

    const title = req.body.title?.trim();
    const paintingTechnique = req.body.paintingTechnique?.trim();
    const artPicture = req.body.artPicture?.trim();
    const certificate = req.body.certificate?.trim().toLowerCase();
    const author = req.user._id;

    const publication = { title, paintingTechnique, artPicture, certificate, author };

    try {
        const publication = await getPublicationById(publicationId).lean();
        if (!publication || publication.author._id != loggedUser) {
            throw new Error('Bad request!');
        }
        await editPublicationById(publicationId,title,paintingTechnique,artPicture,certificate);
        res.redirect(`/posts/${publicationId}/details`);
    } catch (err) {
        const error = getErrorMessage(err);
        res.status(400).render('tasks/edit', {error, publication });
    }
});

router.get('/:publicationId/edit',mustBeAuth,async(req,res)=>{
    const publicationId = req.params.publicationId;
    const loggedUser = req.user._id;
    try {
        const publication = await getPublicationById(publicationId).lean();
        if (!publication || publication.author._id != loggedUser) {
            throw new Error('Bad request!');
        }
        await editPublicationById(publicationId,title,paintingTechnique,artPicture,certificate);
        res.redirect(`/posts/${publicationId}/details`);
    } catch (err) {
        const error = getErrorMessage(err);
        res.status(400).render('tasks/edit', {error, publication });
    }
});

router.get('/:publicationId/share',mustBeAuth,async(req,res)=>{
    const publicationId = req.params.publicationId;
    const loggedUser = req.user._id;
    try {
        const publication = await getPublicationById(publicationId).lean();
        if (!publication || publication.author._id == loggedUser) {
            throw new Error('Bad request!');
        }
        await sharePublication(publicationId,loggedUser,publication);
        res.redirect('/');
    } catch (err) {
        res.status(404).render('404');
    }
});
module.exports = router;