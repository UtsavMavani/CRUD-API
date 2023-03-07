const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "user",
  //   required: [true, "User id required"],
  //   trim: true
  // },
  name: {
    type: String,
    required: [true, "Name required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Description required"],
    trim: true
  },
  noOfPage: {
    type: Number,
    required: [true, "No Of Page required"],
    trim: true,
    min: [0, "No Of Page dose not less then 0"]
  },
  author: {
    type: String,
    required: [true, "Author required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Price required"],
    trim: true,
    min: [0, "Price dose not less then 0"]
  },
  releasedYear: {
    type: Number,
    required: [true, "Released year required"],
    trim: true,
  },
  status: {
    type: Boolean,
    required: [true, "Status required"],
    trim: true,
    enum: ['true', 'false'],
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("book", bookSchema);