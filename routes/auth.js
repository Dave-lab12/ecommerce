const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
//Register
router.post("/register", async (req, res) => {
  //todo validate the input and send a 400 with a clear message
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(err);
  }
});
//login

router.post("/login", async (req, res) => {
  //todo proper validation for the request
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json({ message: "username not found" });
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const pass = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (pass !== req.body.password) {
      return res.status(401).json({ message: "password is not correct" });
    }
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
