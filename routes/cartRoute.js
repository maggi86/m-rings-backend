const express = require("express");
const bodyparser = require("body-parser");
const connection = require("../config/dbmysql");
const router = express.Router();
const middleware = require("../middleware/auth");

// get cart items from user
router.get("/users/:id/cart", middleware, (req, res) => {
  try {
    const strQuery = "SELECT cart FROM users WHERE id = ?";
    connection.query(strQuery, [req.user.id], (err, results) => {
      if (err) throw err;
      (function Check(a, b) {
        a = parseInt(req.user.id);
        b = parseInt(req.params.id);
        if (a === b) {
          res.json(results[0].cart);
        } else {
          res.json({
            msg: "Please Login",
          });
        }
      })();
    });
  } catch (error) {
    throw error;
  }
});

// add cart items
router.post("/users/:id/cart", bodyparser.json(), middleware, (req, res) => {
  try {
    let { id } = req.body;
    const qCart = ` SELECT cart
      FROM users
      WHERE id = ?;
      `;
    connection.query(qCart, req.user.id, (err, results) => {
      if (err) throw err;
      let cart;
      if (results.length > 0) {
        if (results[0].cart === null) {
          cart = [];
        } else {
          cart = JSON.parse(results[0].cart);
        }
      }
      const strProd = `
      SELECT *
      FROM products
      WHERE id = ${id};
      `;
      connection.query(strProd, async (err, results) => {
        if (err) throw err;

        let product = {
            itemid : cart.length + 1,
          title: results[0].title,
          img: results[0].img,
          catergory: results[0].catergory,
          description: results[0].description,
          price: results[0].price,
        };

        cart.push(product);
        // res.send(cart)
        const strQuery = `UPDATE users
      SET cart = ?
      WHERE (id = ${req.user.id})`;
        connection.query(
          strQuery,
          /*req.user.id */ JSON.stringify(cart),
          (err) => {
            if (err) throw err;
            res.json({
              results,
              msg: "Product added to Cart",
            });
          }
        );
      });
    });
  } catch (error) {
    console.log(error.message);
  }
});

// delete one item from cart
router.delete("/users/:id/cart/:itemid", middleware, (req, res) => {
  const dCart = `SELECT cart
    FROM users
    WHERE id = ?`;
  connection.query(dCart, req.user.id, (err, results) => {
    if (err) throw err;
    let item = JSON.parse(results[0].cart).filter((x) => {
      return x.itemid != req.params.itemid;
    });
    item.forEach((id, pos) => {
      id.itemid = pos + 1
    });
    // res.send(item)
    const strQry = `
    UPDATE users
    SET cart = ?
    WHERE id= ? ;
    `;
    connection.query(
      strQry,
      [JSON.stringify(item), req.user.id],
      (err, data, fields) => {
        if (err) throw err;
        res.json({
          msg: "Item Removed from Cart",
        });
      }
    );
  });
});

// delete all cart items
router.delete("/users/:id/cart", middleware, (req, res) => {
  const dCart = `SELECT cart 
    FROM users
    WHERE id = ?`;

  connection.query(dCart, req.user.id, (err, results) => {
  });
  const strQry = `
    UPDATE users
      SET cart = null
      WHERE (id = ?);
      `;
  connection.query(strQry, [req.user.id], (err, data, fields) => {
    if (err) throw err;
    res.json({
      msg: "All Items in Cart Deleted",
    });
  });
});

module.exports = router