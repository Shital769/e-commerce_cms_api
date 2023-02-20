import SessionTokenSchema from "./SessionTokenSchema.js";

export const createNewSession = (obj) => {
  return SessionTokenSchema(obj).save();
};

//delete sessions
export const deleteSession = (filter) => {
  return SessionTokenSchema.findOneAndDelete(filter);
};
