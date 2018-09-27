var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

  res.json([{ user: 'toby' }, {user: 'tina'}]);

});

module.exports = router;
