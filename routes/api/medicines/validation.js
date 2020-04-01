const Medicine = require("../../../models/Medicine");
exports.validationOnInsert = async (req, res, next) => {
  if (!isAuthorized(req.user)) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
  /**
   * validation for medicine
   */
  if (!isEmpty(req.body)) {
    const { name } = req.body;
    let medicineExist = await Medicine.findOne({ name });
    if (!medicineExist) {
      next();
    } else {
      return res.status(400).json({ message: "Medicine name Already exist" });
    }
  } else {
    return res.status(400).json({ message: "Please Enter correct details" });
  }
};

exports.validateOnUpdate = async (req, res, next) => {
  if (req.param.medicineId) {
    let medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(400).json({
        message: `Medicine Not Found With The id of ${req.params.id}`
      });
    }
    if (!isAuthorized(req.user)) {
      return res.status(401).json({ message: "UnAuthorized" });
    }
    next();
  } else {
    return res.status(400).json({ message: "Please select Medicine Id" });
  }
};

exports.validateOnDelete = async (req, res, next) => {
  if (req.param.medicineId) {
    let medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(400).json({
        message: `Medicine Not Found With The id of ${req.params.id}`
      });
    }
    if (!isAuthorized(req.user)) {
      return res.status(401).json({ message: "UnAuthorized" });
    }
    next();
  } else {
    return res.status(400).json({ message: "Please select Medicine Id" });
  }
};

const isAuthorized = user => {
  if (user.role && user.role === "seller") {
    return true;
  } else {
    return false;
  }
};

const isEmpty = credientials => {
  if (!credientials) {
    return true;
  }
  if (
    !credientials.name ||
    !credientials.category ||
    !credientials.highlights ||
    !credientials.diseases ||
    !credientials.originalPrice ||
    !credientials.discountPercent
  ) {
    return true;
  }
  return false;
};
