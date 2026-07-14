import ApiError from "../utils/apiError.js";

export default function authorize(...allowedRoles) {
  return (req, res, next) => {
    console.log("Logged User Role:", req.user?.role);
    console.log("Allowed Roles:", allowedRoles);

    if (!req.user) {
      return next(new ApiError(401, "Not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden"));
    }

    next();
  };
}