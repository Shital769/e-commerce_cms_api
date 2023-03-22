import Joi from "joi";

const SHORTSTRING = Joi.string().max(100);
const LONGSTRINNG = Joi.string().max(500);
const SHORTREQUIRED = Joi.string().max(100).required();
const LONGREQUIRED = Joi.string().max(500).required();
const EMAIL = Joi.string().email({ minDomainSegments: 2 });
const NUMBER = Joi.number();
const NUMREQUIRED = Joi.number().required();

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
    address: SHORTSTRING.allow("", null),
    email: EMAIL,
    fName: SHORTREQUIRED,
    lName: SHORTREQUIRED,
    password: SHORTREQUIRED,
    phone: SHORTSTRING.allow("", null),
  });

  joiValidation(schema, req, res, next);
};

export const emailVerificationValidation = (req, res, next) => {
  //conditions
  const schema = Joi.object({
    email: EMAIL,
    emailVerificationCode: SHORTREQUIRED,
  });

  joiValidation(schema, req, res, next);
};

//login
export const loginValidation = (req, res, next) => {
  //conditions
  const schema = Joi.object({
    email: EMAIL,
    password: SHORTREQUIRED,
  });

  joiValidation(schema, req, res, next);
};

//reset password validation
export const resetPassswordValidation = (req, res, next) => {
  //conditions
  const schema = Joi.object({
    email: EMAIL,
    password: SHORTREQUIRED,
    otp: SHORTREQUIRED,
  });

  joiValidation(schema, req, res, next);
};

// category validation

export const updateCategoryValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORTREQUIRED,
    name: SHORTREQUIRED,
    status: SHORTREQUIRED,
  });

  joiValidation(schema, req, res, next);
};

// new payment validation
export const newPaymentValidation = (req, res, next) => {
  const schema = Joi.object({
    name: SHORTREQUIRED,
    description: SHORTREQUIRED,
  });
  joiValidation(schema, req, res, next);
};

//update payment validation
export const updatePaymentValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORTREQUIRED,
    status: SHORTREQUIRED,
    name: SHORTREQUIRED,
    description: SHORTREQUIRED,
  });
  joiValidation(schema, req, res, next);
};

export const newProductValidation = (req, res, next) => {
  const schema = Joi.object({
    status: SHORTSTRING,
    name: SHORTREQUIRED,
    sku: SHORTREQUIRED,
    qty: NUMREQUIRED,
    price: NUMBER,
    salesPrice: NUMBER,
    salesStartDate: SHORTSTRING.allow("", null),
    salesEndDate: SHORTSTRING.allow("", null),
    description: LONGREQUIRED,
  });

  joiValidation(schema, req, res, next);
};

export const editProductValidation = (req, res, next) => {
  console.log(req.body);
  req.body.salesPrice = req.body.salesPrice || 0;
  req.body.salesStartDate = req.body.salesStartDate || null;
  req.body.salesEndDate = req.body.salesEndDate || null;

  const schema = Joi.object({
    _id: SHORTREQUIRED,
    status: SHORTSTRING,
    name: SHORTREQUIRED,
    sku: SHORTREQUIRED,
    qty: NUMREQUIRED,
    price: NUMBER,
    salesPrice: NUMBER,
    ratings: NUMBER,
    mainImage: SHORTSTRING.allow("", null),
    images: LONGSTRINNG.allow("", null),
    imgToDelete: LONGSTRINNG.allow("", null),
    salesStartDate: SHORTSTRING.allow("", null),
    salesEndDate: SHORTSTRING.allow("", null),
    description: LONGREQUIRED,
  });

  joiValidation(schema, req, res, next);
};
