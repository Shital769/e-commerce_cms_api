import ProductSchema from "./ProductSchema.js";

export const createProduct = (obj) => {
  return ProductSchema(obj).save();
};

export const getAllProducts = () => {
  return ProductSchema.find();
};

export const getSingleProduct = (filter) => {
  return ProductSchema.findOne(filter);
};
export const getProductById = (_id) => {
  return ProductSchema.findById(_id);
};

export const updateProduct = (_id, obj) => {
  return ProductSchema.findByIdAndUpdate(_id, obj, { new: true });
};

export const deleteSingleProduct = (filter) => {
  return ProductSchema.findOneAndDelete(filter, obj);
};

//ids Arr must be an array of _id
export const deleteProducts = (isArg) => {
  return ProductSchema.deleteMany({
    _id: { $in: Arg },
  });
};
