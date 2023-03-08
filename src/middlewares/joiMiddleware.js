import Joi from "joi";

const joiValidation = (schema, req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

export const newAdminValidation = (req, res, next) => {
  //conditions
  const schema = Joi.object({
    address: Joi.string().allow("", null),
    email: Joi.string().email({ minDomainSegments: 2 }),
    fName: Joi.string().required(),
    lName: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().allow("", null),
  });

  joiValidation(schema, req, res, next);
};

export const emailVerificationValidation = (req, res, next) => {
  //conditions
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }),
    emailVerificationCode: Joi.string().required(),
  });

  joiValidation(schema, req, res, next);
};

//login
export const loginValidation = (req, res, next) => {
  //conditions
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
  });

  joiValidation(schema, req, res, next);
};

//reset password validation
export const resetPassswordValidation = (req, res, next) => {
  //conditions
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
    otp: Joi.string().required(),
  });

  joiValidation(schema, req, res, next);
};

// category validation

export const updateCategoryValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    status: Joi.string().required(),
  });

  joiValidation(schema, req, res, next);
};

// new payment validation
export const newPaymentValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });
};

//update payment validation
export const updatePaymentValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    status: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
  });
  joiValidation(schema, req, res, next);
};
