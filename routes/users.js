var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {

  var userId = req.params.id;
  console.log("USER ID:", userId)

  // just some dummy data using the id variable
  var user = {"id": userId, "name": `User ${userId}`, "email": `user${userId}@example.com`}

  res.send(user);
});

module.exports = router;
