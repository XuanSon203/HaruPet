const express = require("express");
const path = require("path");
require("dotenv").config();
const flash = require("express-flash");
const connectDb = require("./config/connectData");
const routerAdmin = require("./routes/admin/index");
const router = require("./routes/client/index.router");
const systemConfig = require("./config/system");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const app = express();
connectDb.connect();

const port = process.env.PORT ?? 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static("public"));

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());

app.use(
  session({
    secret: "SDSHDSHDS",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// Sử dụng flash
app.use(flash());

// Router cho admin
routerAdmin(app);
router(app);
// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
