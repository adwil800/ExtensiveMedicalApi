const express = require('express');
const router = express.Router({ mergeParams: true });


const { getQuery, postQuery } = require("../controllers/auth");


//router.route("/").get(getTerceros);
router.route("/:query").get(getQuery).post(postQuery);

//router.route("/target/:target").get(getReviewsTarget); 

module.exports = router;