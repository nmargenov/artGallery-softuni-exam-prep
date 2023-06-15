const router = require('express').Router();

const homeController = require("./controllers/homeController");
const userController = require("./controllers/userController");
const publicationController = require("./controllers/publicationController");

router.use(homeController);
router.use(userController);
router.use('/posts',publicationController);

router.get('*',(req,res)=>{
    res.status(404).render('404');
})

module.exports = router;