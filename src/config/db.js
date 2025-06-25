const mongoose = require('mongoose');

const connectDB= async ()=>{
    await mongoose.connect('mongodb+srv://harshkumarshaw09:DevTinder1234@devtinder.9ck7ivq.mongodb.net/');
}

module.exports={
    connectDB
}
