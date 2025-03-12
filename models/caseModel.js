const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var caseSchema = new mongoose.Schema({
    type:{
        type:String,
        default: "Criminal Investigation",
        enum: ["Criminal Investigation", "Missing Person", "Unidentified Person", "Catastrophe Victim", "Other"]
    },
    description:{
        type:String,
        required:true,
    },
    },{
        timestamps: true
    }
);

//Export the model
module.exports = mongoose.model('Case', caseSchema);