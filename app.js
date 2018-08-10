var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
var app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'https://freedomfrombigtech.com',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.options('*', cors());

routes(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The app is listening on port ${port}`);
});
