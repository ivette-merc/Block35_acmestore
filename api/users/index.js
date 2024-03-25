const { fetchUser, createUser, createFavorites } = require("../../db");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await fetchUser();
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await createUser({ username, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/:user_id/favorites", async (req, res, next) => {
  try {
    const { product_id } = req.body; // req.body.skill_id
    const favorites = await createFavorites({
      user_id: req.params.user_id,
      product_id: product_id,
    });
    res.status(200).send(favorites);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
