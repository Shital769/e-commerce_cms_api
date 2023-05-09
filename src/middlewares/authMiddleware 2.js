import { findUser } from "../models/admin/AdminModel.js";
import { verifyAccessJWT } from "../util/jwt.js";

export const isAuth = async (req, res, next) => {
  try {
    //authorization code process
    //get jwt from header
    const { authorization } = req.headers;

    // check jwt validation in DB
    const decoded = verifyAccessJWT(authorization);
    // console.log(decoded);

    if (decoded?.email) {
      // check if the payload in jwt matches in our admi user
      const user = await findUser({
        email: decoded.email,
      });

      if (user?._id) {
        req.userInfo = user;
        return next();
      }
    }

    //then authirzed = true
    res.status(403).json({
      status: "error",
      message: decoded,
    });
  } catch (error) {
    next(error);
  }
};

export const isValidAccessJWT = async (req, res, next) => {
  try {
    //all the authorization code process
    //get jwt from header
    const { authorization } = req.headers;

    //check jwt validatioon and in DB
    const decoded = verifyAccessJWT(authorization);

    if (decoded?.email) {
      //check if the payload in jwt matches in our admin user
      const user = await findUser({
        email: decoded.email,
      });

      if (user?._id) {
        req.userInfo = user;
        return next();
      }
    }

    //then authorze = true
    res.status(403).json({
      status: "error",
      message: decoded,
    });
  } catch (error) {
    next(error);
  }
};
