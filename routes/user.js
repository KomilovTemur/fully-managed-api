var express = require("express");
var router = express.Router();
const User = require("../model/User");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const multer = require("multer")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/user/avatars")
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.username}.jpg`)
  }

})
const upload = multer({ storage: storage })

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
    let user;
    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 8)
      user = await User.findOneAndUpdate(
        { username: req.params.username },
        { ...req.body, password: hash },
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      user = await User.findOneAndUpdate(
        { username: req.params.username },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e.originalStack);
  }
});

// upload avatar
router.post("/users/:username/uploadAvatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    await User.findOneAndUpdate({ username: req.user.username },
      { avatar: `/user/avatars/${req.user.username}.jpg` }
    ).then(data => {
      res.send(data)
    }).catch(err => {
      res.sendStatus(500).send(err)
    })
  } catch (error) {
    res.sendStatus(500).send(err)
  }
})

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
