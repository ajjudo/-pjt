const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router(); 

router.get('/register',(req,res)=>{
    
    res.render('auth/signup')
})
router.post('/register',async(req,res)=>{
    let {username,password,email,gender,role}=req.body;
    let user=new User({username,email,gender,role});
    let newUser=await User.register(user,password);
    // req.flash('success' , `Welcome to CelestialCart ${username}`);
    
    res.redirect('/login');
});
router.get('/login',(req,res)=>{
    res.render('auth/login')
})

router.post('/login',
   passport.authenticate('local',{ 
   failureRedirect: '/login', failureMessage: true
   }),(req, res)=>{
   try {
    req.flash('success' , `Welcome  ${req.user.username} in CelestialCart`);
    res.redirect('/products'); 
   
   } catch(e){
    res.status(500).render('error' , {err:e.message});
}
   
});

router.get('/logout' , (req,res)=>{
    req.logout(()=>{
        req.flash('success' , 'Logged out successfully')
        res.redirect('/login');
    });
})


module.exports = router;

