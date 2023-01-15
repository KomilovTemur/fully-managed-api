var express = require("express");
var router = express.Router();
const User = require("../model/Model");
const auth = require("../middleware/auth");

// get all users
router.get("/", function (req, res) {
  User.find({}).exec((err, homes) => {
    if (err) throw err;
    res.json(homes);
  });
});

// signup user
router.post("/signUp", async (req, res) => {
  const { email } = req.body;
  const find = await User.findOne({ email });
  if (find == null) {
    const user = new User(req.body);
    user
      .save()
      .then(() => {
        res.send(user);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } else {
    res.send({ error: "Email already exist" });
  }
});

// login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const data = await User.findByCredentials(email, password);
  if (data.error) {
    res.send(data);
  } else {
    const token = await data.generateAuthToken();
    req.user = {
      _id: data._id,
      token: token,
    };
    res.send(req.user);
  }
});

// get user with id
router.get("/users/:username", (req, res) => {
  const username = req.params.username;
  User.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  });
});

// settings router
router.get("/settings", auth, async (req, res) => {
  res.send(req.user);
});

// Updating user
router.patch("/users/:username", auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(req.params.username, req.body, {
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

// Delete user
router.delete("/users/:id", auth, async (req, res) => {
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

module.exports = router;
