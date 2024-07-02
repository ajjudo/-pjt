const express = require('express');
const app = express() 
const path = require('path');
const mongoose = require('mongoose');
const seedDB = require('./seed');
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const authRoutes = require("./routes/auth");
const passport = require('passport'); //pass
const LocalStrategy = require('passport-local'); //pass
const User = require('./models/User'); //pass
const productApi = require('./routes/api/productapi');
const cartRoutes = require("./routes/cart");
let configsession={
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
    cookie:{
        httpOnly:true , 
        expires : Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000
    }
  }



mongoose.connect('mongodb://127.0.0.1:27017/julybatch')
.then(()=>{console.log("DB connected")})
.catch((err)=>{console.log("Error is: " , err)})


app.set('view engine' , 'ejs')
app.set('views' , path.join(__dirname , 'views'))
app.use(express.static(path.join(__dirname , 'public')));

app.use(express.urlencoded({extended:true})) 
app.use(methodOverride('_method'))

// seedDB() 



app.use(session(configsession));
app.use(flash());

// all are use for passport remember all this stuff
app.use(passport.initialize()); //pass
app.use(passport.session()); //pass
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// iske baad he aayega
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    // console.log(req.user);
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.get('/',(req,res)=>{
    res.render('home');
})

app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(productApi);
app.use(cartRoutes)

const PORT = 8080;
app.listen(PORT , ()=>{
    console.log(`Server running at port : ${PORT}`)
})

