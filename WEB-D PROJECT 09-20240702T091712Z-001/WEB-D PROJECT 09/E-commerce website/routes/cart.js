const express = require('express');
const User = require('../models/User');
const { isLoggedin } = require('../middleware');
const Product = require('../models/Product');
const router = express.Router(); 
const stripe = require('stripe')('sk_test_51OyU0dSBko0KmiZ7fktGoSXNew1LaVwWyNAvs8WLsbxFUq8hGjNjl2cuEdaEUxzKKFeF3fhibCWzb5dDdMtFNe3g00oGyJCNCz')
// secret key iske saath attach krna padega otherwise it won't work.

router.get("/user/cart",async(req,res)=>{
    let userId=req.user._id;
    let user=await User.findById(userId).populate("cart");
    let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
    res.render('cart/cart',{user,totalAmount})
})

// router.get('/checkout',async(req,res)=>{
//     let userId=req.user._id;
//     let user=await User.findById(userId).populate("cart");
//     let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
//     const session = await stripe.checkout.sessions.create({
//         line_items: [
//           {
//             price_data: {
//               currency: 'inr',
//               product_data: {
//                 name: 'T-shirt',
//               },
//               unit_amount: totalAmount*100,
//             },
//             quantity: 1,
//           },
//         ],
//         mode: 'payment',
//         success_url: 'http://localhost:4242/success',
//         cancel_url: 'http://localhost:4242/cancel',
//       });
    
//       res.redirect(303, session.url);
// })
router.get('/payment/:id',async(req,res)=>{
    let id=req.params.id;
    let data= await User.findById(id).populate('cart')  
    let cart=[...data.cart];
    let g= cart.map((item)=>{
      return item;
    })   
    const session = await stripe.checkout.sessions.create({
      line_items: g.map((item)=>{
        return{
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price*100,
          },
          quantity: 1,
        }
      }),
      mode: 'payment',
      success_url: 'http://localhost:4242/success',
      cancel_url: 'http://localhost:4242/cancel',
    });
  
    res.redirect(303, session.url);
})

// router.delete('/user/:id',async(req,res)=>{
//   let {id}=req.params;
//   await User.findByIdAndDelete(id,{$pull:{cart:id}});
//   req.flash('success',"cart item successfully removed");
//   res.redirect(`/user/cart`)
// })

router.post("/user/:productId/add",isLoggedin,async(req,res)=>{
    let {productId}=req.params;
    let userId=req.user._id;
    let user=await User.findById(userId);
    let product=await Product.findById(productId);
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart');
})


module.exports = router;

