const router = require('express').Router();

router.get('/gallery',async (req,res)=>{
    res.status(302).render('tasks/gallery')
});

module.exports = router;