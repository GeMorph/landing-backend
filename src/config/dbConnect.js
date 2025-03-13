const { default: mongoose } = require('mongoose');
const { logger } = require('../utils/logger'); 

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info("Connected to the Database Successfully");
    } catch (error) {
        logger.error("Couldn't connect to the database", { error: error.message });
    }
};

module.exports = dbConnect;