const { getAllPublications } = require('../managers/publicationManager');
const { getUserById } = require('../managers/userManager');
const { mustBeAuth } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.get(['/','/index'],async(req,res)=>{
    try{
        const publications = await getAllPublications().lean();
        const hasPublications = publications.length>0;
        console.log(publications);
        res.status(302).render('home',{publications,hasPublications});
    }catch(err){

    }
});

router.get('/profile',mustBeAuth,async(req,res)=>{
    try{
        const loggedUser = req.user._id;
        const publications = await getAllPublications().lean();
        const sharedPublicaitons = publications.filter(p=>p.usersShared.toString().includes(loggedUser)).map(p=>p.title).join(', ');
        const userPublications = publications.filter(p=>p.author.toString() == loggedUser).map(p=>p.title).join(', ');
        console.log(sharedPublicaitons);
        const user = await getUserById(loggedUser).lean(); 
        res.status(302).render('profile',{user,userPublications,sharedPublicaitons});
    }catch(err){

    }
});

module.exports = router;