import express from "express";
import UserRoutes from "./routes/user.js";
import BlogRouters from "./routes/blog.js";
import Auth from "./models/googleauth.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import checkForAuthenticationCookie from "./middleware/authentication.js";
import session from "express-session";
import passport from "passport";
import Blog from "./models/blog.js";
import path from "path";
import cors from "cors";
const app = express();
//const PORT = process.env.POST || 7000;

mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then((e) => console.log("MongoDB connected"));

app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve("./public")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use(
  session({
    name: "tubo-session",
    keys: ["key1", "key2"],
    secret: "keyboard cat",
  })
);
const islogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.get("/success", islogin, async (req, res) => {
  const { displayName, email,picture } = req.user;
  console.log("user", req.user);
  await Auth.create({
    name: displayName,
    email: email,
    picture:picture
  });
   res.redirect("/");
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
);

app.use("/user", UserRoutes);
app.use("/blog", BlogRouters);

app.listen(5000, () => {
  console.log("App is runing");
});
