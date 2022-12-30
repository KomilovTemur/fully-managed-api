var express = require("express");
var router = express.Router();
const Homes = require("../model/Homes");
const User = require("../model/Model");

router.get("/", function (req, res) {
  Homes.find().exec((err, homes) => {
    if (err) throw err;
    res.json(homes);
  });
});

router.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/users/:id", (req, res) => {
  const _id = req.params.id

  User.findById(_id).then(user => {
    if (!user) {
      return res.status(404).send()
    }

    res.send(user)
  })
})

router.post("/addNewPost", async (req, res) => {
  const home = await new Homes(req.body);
  await home.save();
  res.sendStatus(200);
});

module.exports = router;
