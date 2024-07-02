const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { validateProduct, isLoggedin, isSeller, isProductAuthor } = require('../middleware');
const router = express.Router(); 

//read
router.get('/products'  , async (req,res)=>{
    try{

        let products = await Product.find({});
        res.render('products/index' , {products})
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
});

//new form
router.get('/products/new',isLoggedin,isSeller, (req,res)=>{
    try{
        res.render('products/new');
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

//actually adding
router.post('/products', validateProduct ,isLoggedin,isSeller, async(req,res)=>{
    try{
        let {name , img , price , desc} = req.body;
        await Product.create({name , img , price , desc,author:req.user._id}); 
        req.flash('success' , 'Product added successfully');
        res.redirect('/products');
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

//show particular product
router.get('/products/:id' ,isLoggedin, async(req,res)=>{
    try{

        let {id} = req.params;
        let foundProduct = await Product.findById(id).populate('reviews');
        // console.log(foundProduct);
        res.render('products/show' , {foundProduct} );
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

//show edit form
router.get('/products/:id/edit' ,isLoggedin,isSeller,isProductAuthor, async(req,res)=>{
    try{
        let {id} = req.params;
        // let foundProduct = await Product.findById(id);
        let foundProduct = await Product.findById(id);
        res.render('products/edit' , {foundProduct})
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

//actully changing the product
router.patch('/products/:id' ,isLoggedin, validateProduct ,isSeller,isProductAuthor, async(req,res)=>{
    try{
        let {id} = req.params;
        let {name , img , price , desc} = req.body;
        await Product.findByIdAndUpdate(id , {name , img , price , desc} );
        req.flash('success' , 'Product edited successfully')
        res.redirect('/products')
    }
    catch(e){
       
        res.status(500).render('error' , {err:e.message});
    }
})

//deleting
router.delete('/products/:id' ,isLoggedin,isSeller,isProductAuthor, async(req,res)=>{
    try{
        let {id} = req.params;
        let foundProduct = await Product.findById(id);
        for(let ids of foundProduct.reviews){
            await Review.findByIdAndDelete(ids);
        }

        await Product.findByIdAndDelete(id);
        req.flash('success' , 'Product deleted successfully');
        res.redirect('/products');
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

module.exports = router;

