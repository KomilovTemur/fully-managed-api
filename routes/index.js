var express = require('express');
var router = express.Router();
const Homes = require("../model/Homes")

router.get('/', function(req, res) {
  Homes.find().exec((err, homes) => {
    if (err) throw err
    res.json(homes)
  })
});

router.post('/addNewPost', async (req, res) => {
  const home = await new Homes(req.body)
  await home.save();
  res.sendStatus(200)
})

module.exports = router;
