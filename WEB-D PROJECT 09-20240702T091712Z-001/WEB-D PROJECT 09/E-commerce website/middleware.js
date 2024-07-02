const Product = require('./models/Product');
const Review = require('./models/Review');
const {productSchema , reviewSchema} = require('./schema')


const validateProduct = (req,res,next)=>{
    let {name , img , price , desc} = req.body;
    const {error} = productSchema.validate({name , img , price , desc})
    if(error){
        const msg =  error.details.map((err)=>err.message).join(',')
        return  res.render('error' , {err:msg})
    }
    next();
}

const validateReview = (req,res,next)=>{
    let {rating} = req.body;
    const {error} = reviewSchema.validate({rating})
    if(error){
        const msg =  error.details.map((err)=>err.message).join(',')
        return  res.render('error' , {err:msg})
    }
    next();
}

const isLoggedin = (req,res,next)=>{
   
    if(req.xhr && !req.isAuthenticated()){
        return res.status(401).send('unauthorised');
        // console.log(req.xhr);//ajax hai ya nhi hai?
    }
   if(!req.isAuthenticated()){
       req.flash("error","You need to login first");
       return res.redirect('/login');
   }
   next();
}
const isSeller = (req,res,next)=>{
// let {id}=req.params;
   if(!req.user.role){
    req.flash("error","You do not have a permission");
    
    return res.redirect('/products')
   }
   else if(req.user.role!=="seller"){
    req.flash("error","You do not have a permission");
    // return res.redirect(`/products/${id}`) --> yeh krnw hum new nahi bna paayengey bcz new ke liye koi id nhi hoti
    return res.redirect(`/products`)
   }
   next();
}

const isProductAuthor = async (req,res,next)=>{
    let {id}=req.params;
    let product=await Product.findById(id);
    if(!product.author.equals(req.user._id)){ 
        req.flash('error' , 'You are not the owner of this product');
        return res.redirect(`/products/${id}`)        
    }
    next();
 }
//  const isReviewAuthor = async (req,res,next)=>{
//     let {id}=req.params;
//     let review=await Review.findById(id);
//     if(!review.author.equals(req.user._id)){ 
//         req.flash('error' , 'You are not the owner of this product');
//         return res.redirect(`/products/${id}`)        
//     }
//     next();
//  }


module.exports = {validateProduct , validateReview ,isLoggedin,isSeller,isProductAuthor}

