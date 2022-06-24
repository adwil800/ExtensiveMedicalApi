const express = require('express');
const router = express.Router({ mergeParams: true });


const { registerProvider, getAllProviders, getProvider, updateProvider } = require('../controllers/providers');


router.route("/new").post(registerProvider);
router.route("/all/:idProveedor").get(getProvider).post(updateProvider);
router.route("/all").get(getAllProviders);

//router.route("/target/:target").get(getReviewsTarget); 

module.exports = router;