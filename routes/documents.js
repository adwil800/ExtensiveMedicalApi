const express = require('express');
const router = express.Router({ mergeParams: true });


const { registerDocument, registerDocumentType, getAllDocuments, getPatientDocuments, getProviderDocuments, registerPharmacy } = require('../controllers/documents');

router.route("/new").post(registerDocument);
router.route("/new/type").post(registerDocumentType);
router.route("/new/pharmacy").post(registerPharmacy);

router.route("/all").get(getAllDocuments);
router.route("/:patientId").get(getPatientDocuments);
router.route("/:providerId").get(getProviderDocuments);

//router.route("/target/:target").get(getReviewsTarget); 

module.exports = router;