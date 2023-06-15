const { getAllPublications } = require('../managers/publicationManager');

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

module.exports = router;