const { User } = require("../Models/userAuth");
const { CustomError } = require("../Utils/CustomError");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { tokenExpired } = require("../Utils/checkTokenExpire");
const jwt = require("jsonwebtoken");
const{tokenModel}=require('../Models/userTokenRevoke')
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}
async function isUsernameTaken(username) {
  const existingUser = await User.findOne({ username: username });
  return !!existingUser; // Returns true if the username is already taken
}

async function isEmailTaken(email) {
  const existingUser = await User.findOne({ email: email });
  return !!existingUser; // Returns true if the email is already taken
}

const userRegister = async (req, res, next) => {
  // Check if username and email are already taken

  if (await isEmailTaken(req.body.email)) {
    return res.status(400).json({ error: "Email is already registered." });
  }
  if (await isUsernameTaken(req.body.username)) {
    return res.status(400).json({ error: "Username is already taken." });
  }

  const password = await hashPassword(req.body.password);
  const newUser = await User.create({
    email: req.body.email,
    username: req.body.username,
    password: password,
  });
  newUser
    .save()
    .then((data) => {
      const tokenExpiration = new Date();
      tokenExpiration.setTime(tokenExpiration.getTime() + 10 * 60 * 1000); // 10 minutes from now

      const refreshTokenExpiration = new Date();
      refreshTokenExpiration.setTime(
        refreshTokenExpiration.getTime() + 24 * 60 * 60 * 1000
      ); // 24 hours from now

      const payload = {
        username: data.username,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      };

      const refreshPayload = {
        username: data.username,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      };
      const token = jwt.sign(payload, process.env.TokenSecret);
      const refresh = jwt.sign(refreshPayload, process.env.RefreshSecret);
      res.cookie("token", token, { expires: tokenExpiration, httpOnly: true });
      res.cookie("refreshtoken", refresh, {
        expires: refreshTokenExpiration,
        httpOnly: true,
      });
      res.status(201).json({ userCreated: data });
    })
    .catch((err) => {
      console.log(err);
      next(new CustomError(404, err.message, err.Code));
    });
};

const login = async (req, res, next) => {
  const tokenexpire = await tokenExpired(
    req.cookies.token,
    req.cookies.refreshtoken
  );
  if (!tokenexpire.token && !tokenexpire.refreshtoken) {
    return res.status(404).send("user already logged in");
  }
  if (!req.body.password) {
    return res.status(404).send("enter password please");
  }
  // Handle user login here
  if (req.body.username) {
    const findUser = await User.findOne({ username: req.body.username });
    if (!findUser) {
      return res.status(400).send("couldn't find user");
    }
    const matchP = await bcrypt.compare(req.body.password, findUser.password);
    if (matchP) {
      const tokenExpiration = new Date();
      tokenExpiration.setTime(tokenExpiration.getTime() + 10 * 60 * 1000); // 10 minutes from now

      const refreshTokenExpiration = new Date();
      refreshTokenExpiration.setTime(
        refreshTokenExpiration.getTime() + 24 * 60 * 60 * 1000
      ); // 24 hours from now

      const payload = {
        username: findUser.username,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      };
      const refreshPayload = {
        username: findUser.username,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      };
      const token = jwt.sign(payload, process.env.TokenSecret);
      const refresh = jwt.sign(refreshPayload, process.env.RefreshSecret);
      res.cookie("token", token, {
        expires: tokenExpiration,
        httpOnly: true,
      });
      res.cookie("refreshtoken", refresh, {
        expires: refreshTokenExpiration,
        httpOnly: true,
      });
      res.status(200).send("user logged in");
    } else {
      if (!matchP) {
        return next(new CustomError(400, "password doesn't match"));
      }
      next(new CustomError(404, "user Not found"));
    }
  } else if (req.body.email) {
    const findUser = await User.findOne({ email: req.body.email });
    if (!findUser) {
      return res.status(400).send("couldn't find user");
    }
    const matchP = await bcrypt.compare(req.body.password, findUser.password);
    if (findUser && matchP) {
      const tokenExpiration = new Date();
      tokenExpiration.setTime(tokenExpiration.getTime() + 10 * 60 * 1000); // 10 minutes from now

      const refreshTokenExpiration = new Date();
      refreshTokenExpiration.setTime(
        refreshTokenExpiration.getTime() + 24 * 60 * 60 * 1000
      ); // 24 hours from now

      const payload = {
        username: findUser.username,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      };
      const refreshPayload = (payload.exp =
        Math.floor(Date.now() / 1000) + 60 * 60 * 24);
      const token = jwt.sign(payload, process.env.TokenSecret);
      const refresh = jwt.sign(refreshPayload, process.env.RefreshSecret);
      res.cookie("token", token, {
        expires: tokenExpiration,
        httpOnly: true,
      });
      res.cookie("refreshtoken", refresh, {
        expires: refreshTokenExpiration,
        httpOnly: true,
      });
      res.status(200).send("user logged in");
    } else {
      if (!matchP) {
        return next(new CustomError(400, "password doesn't match"));
      }
      next(new CustomError(404, "user Not found"));
    }
  }else{
    res.status(400).send('please enter email or username')
  }
};

const logout = async (req, res, next) => {
  // Handle user logout here
  const tokenexpire = await tokenExpired(
    req.cookies.token,
    req.cookies.refreshtoken
  );
  console.log(tokenexpire);
  if (tokenexpire.token && tokenexpire.refreshtoken) {
    return res.status(400).send("user logged out already");
  }
  if (!req.body.username) {
    return res.status(400).send("please provide username");
  }
  const gettokendoc = await tokenModel.findOne({
    username: req.body.username,
  });
  if (gettokendoc) {
    let tokeflag = false,
      refreshtokenflag = false;
    const tokenentries = Array.from(gettokendoc.tokens.entries());
    const refreshentries = Array.from(gettokendoc.refreshtokens.entries());
    gettokendoc.tokens.forEach((val) => {
      console.log(val);
      if (val == req.cookies.token) {
        tokeflag = true;
      }
    });
    gettokendoc.refreshtokens.forEach((val) => {
      // console.log(val);
      if (val == req.cookies.refreshtoken) {
        refreshtokenflag = true;
      }
    });
    if (!tokeflag) {
      gettokendoc.tokens.set(tokenentries.length + 1 + "", req.cookies.token);
    }
    if (!refreshtokenflag) {
      gettokendoc.refreshtokens.set(
        refreshentries.length + 1 + "",
        req.cookies.refreshtoken
      );
    }
    if (tokeflag && refreshtokenflag) {
      return res.status(400).send("tokens already revoked");
    }
    gettokendoc.save();
    res.clearCookie("token");
    res.clearCookie("refreshtoken");
    res.status(200).send(gettokendoc);
  } else {
    const tokendoc = new tokenModel({
      username: req.body.username,
      tokens: new Map([["1", req.cookies.token]]),
      refreshtokens: new Map([["1", req.cookies.refreshtoken]]),
    });
    tokendoc
      .save()
      .then((data) => {
        console.log(data);
        res.clearCookie("token");
        res.clearCookie("refreshtoken");
        res.status(200).send("User logged out");
      })
      .catch((err) => {
        console.log(err);
        next(new CustomError(400, err.message));
      });
  }

  // res.status(200).send("User logged out");
};
module.exports = { userRegister, login, logout };
