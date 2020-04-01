const express = require("express");
const passport = require("passport");

const {
  createMedicine,
  updateMedicine,
  getMedicines,
  getMedicine,
  deleteMedicine,
  updateMedicineStock
} = require("../../../controllers/medicines");

const {
  validationOnInsert,
  validateOnUpdate,
  validateOnDelete
} = require("./validation");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validationOnInsert,
  createMedicine
);

router.put(
  "/:medicineId",
  passport.authenticate("jwt", { session: false }),
  validateOnUpdate,
  updateMedicine
);

router.get("/", getMedicines);

router.get("/:medicineId", getMedicine);

router.delete(
  "/:medicineId",
  passport.authenticate("jwt", { session: false }),
  validateOnDelete,
  deleteMedicine
);

router.put(
  "/updateStock/:medicineId",
  passport.authenticate("jwt", { session: false }),
  validateOnUpdate,
  updateMedicineStock
);

module.exports = router;
