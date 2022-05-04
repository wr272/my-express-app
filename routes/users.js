var express = require('express');

const {isLoggedIn} = require("./protected")
const {fetchUserOrders, createOrder} = require("../services/firestore-service")

var router = express.Router();

router.get('/users/profile', isLoggedIn, (req, res) => {
  console.log("USERS:", req.users)
  //> {
  //>   provider: 'google',
  //>   sub: '...',
  //>   id: '...',
  //>   displayName: 'First M Last',
  //>   name: { givenName: 'First M', familyName: 'Last' },
  //>   given_name: 'First M',
  //>   family_name: 'Last',
  //>   email_verified: true,
  //>   verified: true,
  //>   language: 'en',
  //>   locale: undefined,
  //>   email: 'hello@gmail.com',
  //>   emails: [ { value: 'hello@gmail.com', type: 'account' } ],
  //>   photos: [
  //>     {
  //>       value: 'https://lh3.googleusercontent.com/a-/...',
  //>       type: 'default'
  //>     }
  //>   ],
  //>   picture: 'https://lh3.googleusercontent.com/a-/...',
  //> }
  //console.log(req.user.email, req.user.displayName, req.user.picture)

  res.render("users_profile", {users: req.users})
});


router.get('/users/orders', isLoggedIn, async (req, res) => {
  var email = req.users.email
  console.log("USERS ORDERS...", email)

  try {
      var orders = await fetchUserOrders(email)
      res.render("user_orders", {users: req.users, orders: orders})
  } catch (error) {
      console.log("ERR:", error)
      req.flash("danger", "OOPS, failed to fetch orders.")
      res.redirect("/")
  }
});


router.post('/users/orders/create', isLoggedIn, async (req, res) => {
  var email = req.users.email
  console.log("CREATE ORDER...", email)

  var formData = req.body
  console.log("FORM DATA:", formData)

  var productInfo = {
      "id": formData["product_id"],
      "name": formData["product_name"],
      "description": formData["product_description"],
      "price": formData["product_price"],
      "url": formData["product_url"],
  }
  console.log("PRODUCT INFO:", productInfo)

  try {
      var order = await createOrder(email, productInfo)
      console.log("ORDER:", order)

      req.flash("success", "Order created successfully!")
      res.redirect("/users/orders")
  } catch (error) {
      console.log("ERR:", error)
      req.flash("danger", "OOPS, failed to create the order. Please try again.")
      res.redirect("/")
  }
});


module.exports = router;
