const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL)
.then(() => { 
  console.log("Database connected."); 
})
.catch((error) => { 
  console.log("Database connection error..!", error.message); 
});