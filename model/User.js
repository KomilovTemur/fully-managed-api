const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      required: false,
    },
    age: {
      type: Number,
    },
    email: String,
    password: String,
    avatar: {
      type: String,
      require: false,
    },
    token: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { error: "Unable to find email" };
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { error: "Unable to login" };
  }
  return user;
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.TOKENSECRET,
    {
      expiresIn: "1d",
    }
  );
  user.tokens = user.token.push({ token });
  await user.save();

  return token;
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.token;

  return userObject;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
    user.avatar = "/user/avatars/default.jpg";
    user.username = this._id
  }
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
