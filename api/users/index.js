const {
  fetchUser,
  createUser,
  createFavorites,
  fetchFavorites,
  destroyFavorites,
} = require("../../db");

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
    const user = await createUser({ username: username, password: password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:user_id/favorites", async (req, res, next) => {
  try {
    const favorites = await fetchFavorites(req.params.user_id);
    res.status(200).send(favorites);
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

router.delete("/:userId/favorites/:id", async (req, res) => {
  const { user_id, id } = req.params;
  try {
    await destroyFavorites(user_id, id);
    res.status(200).send("Favorite deleted successfully");
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

// user_id = id
