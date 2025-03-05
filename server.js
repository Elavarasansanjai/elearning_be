require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");
const cors = require("cors");
const fileUpload = require("express-fileupload");
// db c0onection
require("./DB_Config/db_config");
// midlewares
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/api/elearning", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`app listen on ${process.env.PORT}`);
});
