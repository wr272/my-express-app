// this is the "routes/products.js" file...

var express = require('express');
var router = express.Router();

const {fetchProducts} = require("../services/firestore-service")

router.get('/products', async function(req, res, next) {
    try {
        var products = await fetchProducts()

        res.render("products", {"products": products})
    } catch (error) {
        req.flash("danger", "OOPS, failed to fetch products.")
        res.redirect("/")
    }
})



module.exports = router;