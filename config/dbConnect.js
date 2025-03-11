const {default: mongoose} = require('mongoose');

const dbConnect = async() => {
    try{
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Connected to the Database Successfully");
    } 
    catch(error){
        console.log("Couldnt connect to the database");
    }
};
module.exports = dbConnect;