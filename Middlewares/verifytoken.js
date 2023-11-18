const { tokenModel } = require("../Models/userTokenRevoke");
require("dotenv").config();
const jwt=require('jsonwebtoken')
const { tokenExpired } = require("../Utils/checkTokenExpire");
exports.verifytoken=async (req, res, next) => {
    const expire = await tokenExpired(
      req.cookies.token,
      req.cookies.refreshtoken
    );
    if (expire.token && expire.refreshtoken) {
      console.log(expire.token, expire.refreshtoken);
      return res.status(400).send("please login again");
    }
    console.log(expire);
    if (expire.refreshtoken) {
      return res.status(400).send("please login again");
    }
    const decode = jwt.verify(
      req.cookies.refreshtoken,
      process.env.RefreshSecret
    );

    const findtoken = await tokenModel.findOne({ username: decode.username });
    if (expire.token) {
      const payload = {
        username: decode.username,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      };
      res.cookie("token", jwt.sign(payload, process.env.TokenSecret), {
        maxAge: 10 * 60 * 1000,
      });
    }

    let tokenflag = false,
      refreshflag = false;
    for (let value of findtoken.tokens.values()) {
      if (value == req.cookies.token) {
        tokenflag = true;
      }
    }
    for (let value of findtoken.refreshtokens.values()) {
      if (value == req.cookies.refreshtoken) {
        refreshflag = true;
      }
    }
    if (tokenflag || refreshflag) {
      console.log(" found token already revoked");
      return res.status(400).send("please login with correct user credentials");
    } else {
      next();
    }
  }
  