const express = require("express");
const bodyparser = require("body-parser");
const connection = require("../config/dbmysql");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const query = `SELECT * FROM products`;

    connection.query(query, (err, results) => {
      res.json({
        results: results,
      });
    });
  } catch (error) {
    res.json({
      status: 400,
      error: error,
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const query = `SELECT * FROM products WHERE id = ?`;

    connection.query(query, [req.params.id], (err, results) => {
      res.json({
        results: results,
      });
    });
  } catch (error) {
    res.json({
      status: 400,
      error: error,
    });
  }
});

/*
get-gets data
post-adds data
patch-fixes or edits data(single row of data)
put-replace data
delete-name says it all
*/

// add products
router.post("/", bodyparser.json(), (req, res) => {
  try {
    const product = req.body;
    const strQry = `insert into products (id, title, img, catergory, description, price) values(?,?,?,?,?,?)`;
    connection.query(
      strQry,
      [
        product.id,
        product.title,
        product.img,
        product.catergory,
        product.description,
        product.price,
      ],
      (err, results) => {
        if (err) throw err;
      res.json({
        results,
        msg : "Product Added successfully"
      })
      }
    );
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

// Edit id
router.put("/:id", (req, res) => {
  const strQry = `update products set ? where id = ${req.params.id}`;
  const { title, img, catergory, description, price } = req.body;

  const product = {
    title,
    img,
    catergory,
    description,
    price,
  };
  connection.query(strQry, product, (err, results) => {
    if (err) throw err;
    res.json({
      results,
      msg: "Product Updated Successfully",
    });
  });
});

//delete by id
router.delete("/:id", (req, res) => {
  try {
    const query = `DELETE FROM products WHERE id = ${req.params.id}`;

    connection.query(query, (err, results) => {
      if (err) throw err;
      res.json({
        results,
        msg : "Deleted Product Successfully"
      })
    })
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
