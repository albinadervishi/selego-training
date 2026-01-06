const express = require("express");
const passport = require("passport");
const router = express.Router();

const VenueObject = require("../models/venue");
const EventObject = require("../models/event");
const ERROR_CODES = require("../utils/errorCodes");
const { capture } = require("../services/sentry");

/**
 * POST /venue/search - Search venues (PUBLIC)
 */
router.post("/search", async (req, res) => {
  try {
    const { search, city, sort, per_page, page, available_start, available_end } = req.body;

    let query = {};

    if (search) {
      const searchValue = search.replace(/[#-.]|[[-^]|[?|{}]/g, "\\$&");

      query = {
        ...query,
        $or: [
          { name: { $regex: searchValue, $options: "i" } },
          { address: { $regex: searchValue, $options: "i" } },
          { city: { $regex: searchValue, $options: "i" } },
          { country: { $regex: searchValue, $options: "i" } },
        ],
      };
    }

    if (city) query.city = { $regex: city, $options: "i" };

    if (available_start && available_end) {
      const startDateTime = new Date(available_start);
      const endDateTime = new Date(available_end);

      const bookedEvents = await EventObject.find({
        venue_id: { $exists: true, $ne: null },
        status: { $ne: "cancelled" },
        $or: [
          { start_date: { $gte: startDateTime, $lt: endDateTime } },
          { end_date: { $gt: startDateTime, $lte: endDateTime } },
          { start_date: { $lte: startDateTime }, end_date: { $gte: endDateTime } },
        ],
      }).select("venue_id");

      const bookedVenueIds = bookedEvents.map((e) => e.venue_id);

      if (bookedVenueIds.length > 0) {
        query._id = { $nin: bookedVenueIds };
      }
    }

    const limit = per_page || 10;
    const offset = page ? (page - 1) * limit : 0;

    const data = await VenueObject.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sort || { created_at: -1 });

    const total = await VenueObject.countDocuments(query);

    return res.status(200).send({ ok: true, data, total });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

/**
 * GET /venue/:id - Get venue by ID (PUBLIC)
 */
router.get("/:id", async (req, res) => {
  try {
    const data = await VenueObject.findById(req.params.id);

    if (!data) return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });

    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

/**
 * POST /venue - Create venue (USER)
 */
router.post("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const { name, address, city, country, capacity, amenities, image_url } = req.body;

    if (!name || !address || !city) {
      return res.status(400).send({ ok: false, code: "NAME_AND_ADDRESS_AND_CITY_REQUIRED" });
    }

    const venue = await VenueObject.create({
      name,
      address,
      city,
      country,
      capacity,
      amenities,
      image_url,
      owner_id: req.user._id,
      owner_name: req.user.name,
    });

    return res.status(201).send({ ok: true, data: venue });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

/**
 * POST /venue/my-venues/search - Search my venues (USER)
 */
router.post("/my-venues/search", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  try {
    const { search, city, sort, per_page, page } = req.body;

    let query = {};
    if (req.user.role === "user") {
      query.owner_id = req.user._id;
    }

    if (search) {
      const searchValue = search.replace(/[#-.]|[[-^]|[?|{}]/g, "\\$&");
      query = {
        ...query,
        $or: [
          { name: { $regex: searchValue, $options: "i" } },
          { address: { $regex: searchValue, $options: "i" } },
          { city: { $regex: searchValue, $options: "i" } },
          { country: { $regex: searchValue, $options: "i" } },
        ],
      };
    }

    if (city) query.city = { $regex: city, $options: "i" };

    const limit = per_page || 10;
    const offset = page ? (page - 1) * limit : 0;

    const data = await VenueObject.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sort || { created_at: -1 });

    const total = await VenueObject.countDocuments(query);

    return res.status(200).send({ ok: true, data, total });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

/**
 * PUT /venue/:id - Update venue (USER/ADMIN)
 */
router.put("/:id", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  try {
    const venue = await VenueObject.findById(req.params.id);
    if (!venue) return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });

    const isOwner = venue.owner_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).send({ ok: false, code: "FORBIDDEN" });
    }

    const updates = req.body;

    venue.set(updates);
    await venue.save();

    res.status(200).send({ ok: true, data: venue });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

/**
 * DELETE /venue/:id - Delete venue (USER/ADMIN)
 */
router.delete("/:id", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  try {
    const venue = await VenueObject.findById(req.params.id);
    if (!venue) return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });

    const isOwner = venue.owner_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).send({ ok: false, code: "FORBIDDEN" });
    }

    await VenueObject.findByIdAndDelete(req.params.id);

    res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

/**
 * GET /venue/:id/events - Get all upcoming events at this venue (PUBLIC)
 */
router.get("/:id/events", async (req, res) => {
  try {
    const venue = await VenueObject.findById(req.params.id);
    if (!venue) {
      return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });
    }

    const { per_page = 10, page = 1 } = req.query;
    const limit = parseInt(per_page);
    const offset = (parseInt(page) - 1) * limit;

    let query = {
      venue_id: req.params.id,
      status: "published",
      start_date: { $gte: new Date() },
    };

    const data = await EventObject.find(query).skip(offset).limit(limit).sort({ start_date: 1 });

    const total = await EventObject.countDocuments(query);

    return res.status(200).send({ ok: true, data, total });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

module.exports = router;
