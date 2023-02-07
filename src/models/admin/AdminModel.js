import AdminSchema from "./AdminSchema.js";

export const createNewAdmin = (obj) => {
  return AdminSchema(obj).save();
};
