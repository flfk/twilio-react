var express = require('express');
var router = express.Router();

// router.get('/', function(req, res, next) {
//   res.json([{ user: 'toby' }, { user: 'tina' }]);
// });

router.get('/', function(req, res, next) {
  res.json([{ test: process.env.TEST }]);
});

module.exports = router;
