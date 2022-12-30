const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  }
});

module.exports = mongoose.model("User", UserSchema);
