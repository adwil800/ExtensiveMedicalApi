const express = require('express');
const router = express.Router({ mergeParams: true });


const { registerConsultory, getAllConsultories, getConsultory, updateConsultory } = require('../controllers/consultory');

 
router.route("/new").post(registerConsultory);
router.route("/all/:idCentro").get(getConsultory).post(updateConsultory);
router.route("/all").get(getAllConsultories);

//router.route("/target/:target").get(getReviewsTarget); 

module.exports = router;