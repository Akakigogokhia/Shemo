import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

//Register
router.post('/register', async (req, res) => {
  try {
    //generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json('user not found');
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).json('wrong password');

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
