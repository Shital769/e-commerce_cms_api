export const isAuth = (req, res, next) => {
  try {
    //authorization code process
    //get jwt from header 
    // check jwt validation in DB
    // check if the payload in jwt matches in our admi user
    

    const authorized = false;

  authorized
      ? next()
      : res.status(403).json({
          status: "error",
          message: "",
        });
  } catch (error) {
    next(error);
  }
};
