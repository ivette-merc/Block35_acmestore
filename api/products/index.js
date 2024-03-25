const { fetchProduct } = require("../../db");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await fetchProduct();
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});


module.exports = router;