var express = require("express");
var router = express.Router();
const Homes = require("../model/Homes");
const User = require("../model/Model");
const auth = require("../middleware/auth");
const Task = require("../model/Model")

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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByCredentials(email, password);
  // const token = await user.generateAuthToken();
  req.user = {
    _id: user._id,
    // token: token
  }
  res.send(req.user);
});

router.get("/users/:id", (req, res) => {
  const _id = req.params.id;

  User.findById(_id).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  });
});

// Integrating Async/Await
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
  // res.setHeader("Authorization", 'helloworld')
  // res.send(req.header("Authorization"))
});

// me router
router.get("/me", auth, async (req, res) => {
  res.send(req.user)
  // const task = await Task.findById(req.user._id)
  // await task.populate('owner').execPopulate()
  // res.send(task.owner);
})

// Resource Updating Endpoints
router.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Resource Deleting Endpoints

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/addNewPost", async (req, res) => {
  const home = await new Homes(req.body);
  await home.save();
  res.sendStatus(200);
});

module.exports = router;
