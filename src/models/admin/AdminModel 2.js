import AdminSchema from "./AdminSchema.js";

export const createNewAdmin = (obj) => {
  return AdminSchema(obj).save();
};

//@filter and @obj must be an object
//@filter is the search criteria
//@obj is the conetent which will be updated in the DB

export const updateAdmin = (filter, obj) => {
  return AdminSchema.findOneAndUpdate(filter, obj, { new: true });
};

//find a user, @filter must be an object
export const findUser = (filter) => {
  return AdminSchema.findOne(filter);
};
