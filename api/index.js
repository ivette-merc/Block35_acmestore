const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/products", require("./products"));
router.use("/favorites", require("./favorites"));

module.exports = router;
