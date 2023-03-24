const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const createPostedDate = () => {
  const today = new Date()
  return `${today.getDay()}:${today.getMonth()}:${today.getUTCFullYear()}`
}
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
    default: createPostedDate(),
  },
  region: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("homes", HomesSchema);
