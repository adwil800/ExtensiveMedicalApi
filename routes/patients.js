const express = require('express');
const router = express.Router({ mergeParams: true });


const { registerPatient, getPatient, getAllPatients, updatePatient } = require("../controllers/patients");


router.route("/new").post(registerPatient);
router.route("/all/:idPaciente").get(getPatient).post(updatePatient);
router.route("/all").get(getAllPatients);

//router.route("/target/:target").get(getReviewsTarget); 

module.exports = router;