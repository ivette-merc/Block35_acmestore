const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const client = new pg.Client(`postgres://localhost/${process.env.DB_NAME}`);

const createTables = async () => {
  const SQL = /*SQL*/ `
        DROP TABLE IF EXISTS favorites;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products; 

        CREATE TABLE users(
            id UUID PRIMARY KEY, 
            username VARCHAR(75) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL
        );
        CREATE TABLE products(
            id UUID PRIMARY KEY, 
            product_name VARCHAR(75) NOT NULL UNIQUE
        );
        CREATE TABLE favorites(
            id UUID PRIMARY KEY, 
            user_id UUID REFERENCES users(id) NOT NULL, 
            product_id UUID REFERENCES products(id) NOT NULL,
            CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
        );
        `;
  await client.query(SQL);
};

const createUser = async ({ username, password }) => {
  const SQL = /*SQL*/ `INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *`;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 10),
  ]);
  return response.rows[0];
};

const createProduct = async ({ product_name }) => {
  const SQL = /*SQL*/ `
    INSERT INTO products(id, product_name) VALUES ($1, $2) RETURNING *
    `;
  const response = await client.query(SQL, [uuid.v4(), product_name]);
  return response.rows[0];
};

const createFavorites = async ({ user_id, product_id }) => {
  const SQL = /*SQL*/ `INSERT INTO favorites(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
};

const fetchUser = async () => {
  const SQL = /*SQL*/ `
    SELECT * from users;
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProduct = async () => {
  const SQL = /*SQL*/ `
    SELECT * from products;
    `;
  const response = await client.query(SQL);
  return response.rows;
};
//REVIEW THIS CODE
const fetchFavorites = async (user_id) => {
  console.log(user_id);
  const SQL = /*SQL*/ `
    SELECT * from favorites where user_id=$1
    `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};
// const SQL = /*SQL*/ `
//     SELECT * from favorites;
//     `;
// const response = await client.query(SQL);
// return response.rows;

//WHY IS RESPONSE AND SQL GREYED OUT?
// const destroyFavorites = async ( user_id, product_id ) => {
//   const SQl = /*SQL*/ ` DELETE from favorites WHERE user_id=$1 AND product_id=$2`;
//   const response = await client.query(SQL, [user_id, product_id]);
// };

const destroyFavorites = async (user_id, id) => {
  const SQL = `DELETE FROM favorites WHERE user_id=$1 AND id=$2`;
  try {
    const response = await client.query(SQL, [user_id, id]);
    return response; // Return response if needed
  } catch (error) {
    console.error("Error deleting favorites:", error);
    throw error; // Throw error if needed
  }
};

const seed = async () => {
  await Promise.all([
    createUser({ username: "parkjimin", password: "p@ssword123" }),
    createUser({ username: "veetaetae", password: "helloworld1234" }),
    createUser({ username: "hobi94", password: "justDance1234" }),
    createUser({ username: "joonie94", password: "TriviaLove1234" }),
    createUser({ username: "yoongi", password: "agustD1234567" }),
    createUser({ username: "supertunajin", password: "jinjinjinjin" }),
    createUser({ username: "jayyyykayyyy", password: "jayyyyykayyyyy" }),
    createProduct({ product_name: "monitor" }),
    createProduct({ product_name: "microphone" }),
    createProduct({ product_name: "speaker" }),
    createProduct({ product_name: "keyboard" }),
    createProduct({ product_name: "headphones" }),
    createProduct({ product_name: "sneakers" }),
    createProduct({ product_name: "dj set" }),
  ]);
  const users = await fetchUser();
  console.log("users are:", await fetchUser());
  const products = await fetchProduct();
  console.log("products are:", await fetchProduct());

  await Promise.all([
    createFavorites({
      user_id: users[0].id,
      product_id: products[0].id,
    }),
    createFavorites({
      user_id: users[1].id,
      product_id: products[1].id,
    }),
    createFavorites({
      user_id: users[2].id,
      product_id: products[2].id,
    }),
    createFavorites({
      user_id: users[3].id,
      product_id: products[3].id,
    }),
    createFavorites({
      user_id: users[4].id,
      product_id: products[4].id,
    }),
  ]);
  console.log("favorites created:", await fetchFavorites(users[0].id));
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  createFavorites,
  fetchUser,
  fetchProduct,
  fetchFavorites,
  destroyFavorites,
  seed,
};
