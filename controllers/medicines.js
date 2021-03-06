const Medicine = require("../models/Medicine");

//@desc     Get all medicines
//@route    Get /api/v1/medicines
//@access   Public
exports.getMedicines = async (req, res, next) => {
  let medicines = await Medicine.find();
  res.status(200).json(medicines);
};

//@desc     Get single medicine
//@route    Get /api/v1/medicines/:id
//@access   Public
exports.getMedicine = async (req, res, next) => {
  const medicine = await Medicine.findById(req.params.medicineId);
  if (!medicine) {
    return res.status(400).json({
      message: `Medicine Not Found With The id of ${req.params.medicineId}`
    });
  }
  res.status(200).json({ success: true, data: medicine });
};

//@desc     Create Medicine
//@route    Post /api/v1/medicines
//@access   Private
exports.createMedicine = async (req, res, next) => {
  const medicine = await Medicine.create(req.body);
  res.status(201).json({ success: true, data: medicine });
};

//@desc     Update medicine
//@route    Put /api/v1/medicines/:id
//@access   Private
exports.updateMedicine = async (req, res, next) => {
  let medicine = await Medicine.findOneAndUpdate(
    { _id: ObjectID(req.params.medicineId) },
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({ success: true, data: medicine });
};

//@desc     Delete medicine
//@route    Delete /api/v1/medicines/:id
//@access   Private
exports.deleteMedicine = async (req, res, next) => {
  let medicine = await Medicine.findById(req.params.medicineId);
  medicine.remove();
  res.status(200).json({ success: true, data: {} });
};

//@desc     Update medicine
//@route    Put /api/v1/medicines/updateStock/:id
//@access   Private

//not working currently properly
// need to break from foreach loop as soon as update is done otherwise search for the end and add the row into array
exports.updateMedicineStock = async (req, res, next) => {
  //make sure user is seller or seller
  if (req.user.role === "seller") {
    let medicine = await Medicine.findOne({ _id: req.params.medicineId });

    if (medicine.stock.length <= 0) {
      //simple add the user with details
      medicine.stock.unshift({
        seller: req.user.id,
        stockAmount: req.body.stockAmount,
        locLatitude: req.body.locLatitude,
        locLongitude: req.body.locLongitude
      });
      await medicine.save();
      res.status(200).json({ success: true, data: medicine });
    } else {
      medicine.stock.forEach(async (each, index) => {
        if (each.seller == req.user.id) {
          each.stockAmount = req.body.stockAmount;
          each.locLatitude = req.body.locLatitude;
          each.locLongitude = req.body.locLongitude;
          await medicine.save();
          return res.status(200).json({ success: true, data: medicine });
          // break;
        }
        if (index == medicine.stock.length - 1) {
          medicine.stock.unshift({
            seller: req.user.id,
            stockAmount: req.body.stockAmount,
            locLatitude: req.body.locLatitude,
            locLongitude: req.body.locLongitude
          });
          await medicine.save();
          return res.status(200).json({ success: true, data: medicine });
        }
      });
    }
  }
};
