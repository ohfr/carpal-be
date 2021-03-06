const express = require("express");
const router = express.Router();
const { Rides } = require("../Classes/rides");
const { validateRideId } = require("../Middleware/rides");

const rides = new Rides();

router.put("/", validateRideId(), async (req, res, next) => {
    const { driver_id, start_location_id, end_location_id, status } = req.body;
    const changes = { driver_id, start_location_id, end_location_id, status };
    try {
        const updatedRide = await rides.update(req.ride.id, changes);
        res.status(200).json(updatedRide);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
