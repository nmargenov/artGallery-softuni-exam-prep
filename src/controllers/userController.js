const { AUTH_COOKIE } = require('../config/config');
const { register, login } = require('../managers/userManager');
const { mustBeAuth, mustBeGuest } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelper');

const router = require('express').Router();

router.get('/login', mustBeGuest,(req, res) => {
    res.status(302).render('users/login');
});

router.post('/login',mustBeGuest,async(req,res)=>{
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    try{
        const token = await login(username,password);
        res.cookie(AUTH_COOKIE,token);
        res.redirect('/');
    }
    catch(err){
        const error = getErrorMessage(err);
        res.status(400).render('users/login',{error,username});
    }
})

router.get('/register', mustBeGuest,(req, res) => {
    res.status(302).render('users/register');
});

router.post('/register',mustBeGuest,async(req,res)=>{
    const username = req.body.username?.trim();
    const address = req.body.address?.trim();
    const password = req.body.password?.trim();
    const rePassword = req.body.rePassword?.trim();

    try{
        const token = await register(username,address,password,rePassword);
        res.cookie(AUTH_COOKIE,token);
        res.redirect('/');
    }catch(err){
        const error = getErrorMessage(err);
        res.status(400).render('users/register',{error,username,address});
    }
});

router.get('/logout',mustBeAuth,(req,res)=>{
    res.clearCookie(AUTH_COOKIE);
    res.redirect('/');
});
module.exports = router;