require('dotenv').config()
const express = require("express")
const cors = require("cors")
const corsOption = require('./config/CorsOption');
const DB = require('./config/DbConnect');
const app = express();

DB.connect()
// DB.disconnect()

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//route
app.use("/",require("./routes/RegisterShop"));


app.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000}`);
});

