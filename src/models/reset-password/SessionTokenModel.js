import SessionTokenSchema from "./SessionTokenSchema";

export const sessionToken = (obj) => {
  return SessionTokenSchema(obj).save();
};

export const findUser = (filter) => {
  return SessionTokenSchema.findOne(filter);
};
