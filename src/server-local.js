const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbConnect = require('./config/dbConnect');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const caseRoute = require('./routes/caseRoute');
const { logger } = require('./utils/logger'); 

dotenv.config();
dbConnect();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/case', caseRoute);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});