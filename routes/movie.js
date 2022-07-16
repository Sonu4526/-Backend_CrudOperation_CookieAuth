const express = require("express");
const router = express.Router();
const { authorization } = require('../controllers/auth');
const {
    createMovie,
    remove,
    update
} = require("../controllers/movie");
//const { userSignupValidator } = require("../validator");

router.post("/movie", createMovie);
router.get("/remove/:id", authorization, remove);
router.put("/movie/:id", authorization, update);

module.exports = router;
