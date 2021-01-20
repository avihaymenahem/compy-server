const mongoose = require("mongoose");
const { DB_USER, DB_NAME, DB_PASS, DB_URL } = process.env;

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to database'));

return db;