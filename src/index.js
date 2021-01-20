require('dotenv').config();
require("./db/BaseDAL");

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const MainRouter = require('./routes/Main.route');
const TestRouter = require('./routes/Test.route');
const ResultRouter = require('./routes/Result.route');
const SettingsRouter = require('./routes/Settings.route');

const app = express();
const PORT = process.env.PORT || 3005;

// app.use(morgan('tiny'));
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(compression());
app.use('/screenshots', express.static('./screenshots'));

app.use('/test', TestRouter);
app.use('/result', ResultRouter);
app.use('/settings', SettingsRouter);
app.use('/', MainRouter);

app.listen(PORT, () => console.info(`Example app listening at http://localhost:${PORT}`));