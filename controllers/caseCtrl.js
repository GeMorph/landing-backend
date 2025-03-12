const Case = require('../models/caseModel');
const asyncHandler = require('express-async-handler');

const submitCase = asyncHandler(async(req, res) => {
    try {
        const newCase = await Case.create(req.body);
        res.json(newCase)
    }catch(error){
        throw new Error(error)
    }
});

module.exports = {submitCase};