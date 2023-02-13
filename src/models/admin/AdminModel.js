import AdminSchema from "./AdminSchema.js";

export const createNewAdmin = (obj) => {
  return AdminSchema(obj).save();
};

//@filter and @obj must be an object
//@filter is the search criteria
//@obj is the

export const updateAdmin = (filter, obj) => {
  return AdminSchema.findOneAndUpdate(filter, obj, { new: true });
};
