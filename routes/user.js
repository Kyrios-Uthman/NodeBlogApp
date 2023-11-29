import { Router } from "express";
import User from "../models/user.js";
import passport from "passport";
import "../services/passport-setup.js";
import session from "express-session";
const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});
router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log("User", token);
    return res.cookie("token", token).redirect("/");
  } catch (err) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
 const user = await User.create({
    fullName,
    email,
    password,
  });
  res.render("nav",{
    user: fullName
  })
  return res.redirect("/");
});

export default router;
