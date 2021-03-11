const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./model");
const app = express();
const userRoutes = require("./routers/user.router");
const loginRoutes = require("./routers/login.router");

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

userRoutes(app);
loginRoutes(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT,  () => {
    console.log(`Server is listening on port: ${PORT}`);
});

db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.log("Cannot connect to database",err);
    process.exit();
});