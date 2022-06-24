const express = require('express');
const router = express.Router({ mergeParams: true });


const { registerAppointment, registerAppointmentType, getAllAppointments, getAllAppointmentTypes  } = require('../controllers/appointments');


router.route("/new/appt").post(registerAppointment);
router.route("/new/type").post(registerAppointmentType);
router.route("/all/appt").get(getAllAppointments);
router.route("/all/type").get(getAllAppointmentTypes);

//router.route("/target/:target").get(getReviewsTarget); 

module.exports = router;