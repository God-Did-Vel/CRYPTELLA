/**
 * Shared toJSON options: expose `id` instead of `_id`, drop `__v`,
 * never leak password hashes, and flatten Maps into plain objects.
 */
module.exports = {
  virtuals: true,
  versionKey: false,
  flattenMaps: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password;
    return ret;
  },
};
