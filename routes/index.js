var express = require('express');
var router = express.Router();
const Homes = require("../model/Homes")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addNewPost', async (req, res) => {
  const home = await new Homes(req.body)
  await home.save();
  res.json(home)
})

module.exports = router;
