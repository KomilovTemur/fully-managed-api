const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HomesSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  ground: {
    type: String,
    required: true,
  },
  groundType: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  selled: {
    type: Boolean,
    default: false,
  },
  postedDate: {
    type: String,
    default: new Date.UTC(),
  },
});

module.exports = mongoose.model("homes", HomesSchema);
