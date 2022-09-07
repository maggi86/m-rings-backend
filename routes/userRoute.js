const express = require("express");
const bodyparser = require("body-parser");
const connection = require("../config/dbmysql");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcrypt");

//  get all users
router.get("/", (req, res) => {
  try {
    const query = `SELECT * FROM users`;

    connection.query(query, (err, results) => {
      if (err) throw err;
      res.status(200).json({
        results,
        msg: "All users shown",
      });
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

//  get one user
router.get("/:id", (req, res) => {
  try {
    const query = ` SELECT * FROM users WHERE id = ${req.params.id}`;

    connection.query(query, (err, results) => {
        if (results.length === 0) {
            res.status(200).json({
                msg : "There is no user with that id"
            })
        } else {
      res.status(200).json({
        results : results.length,
        msg: "one user shown",
      });}
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// register
router.post("/", bodyparser.json(), async (req, res) => {
  try {
    const user = req.body;

    const eQuery = `SELECT * FROM users WHERE email = '${user.email}'`;

    connection.query(eQuery, async (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        const query = `INSERT INTO users 
                (fname, email, password, profile)
                VALUES (?,?,?,?)`;
        user.password = await hash(user.password, 10);

        connection.query(
          query,
          [user.fname, user.email, user.password, user.profile],
          async (err, results) => {
            if (err) throw err;
            res.status(200).json({
              results,
              msg: "Registration Successful",
            });
          }
        );
      } else {
        res.status(200).json({
          msg: "Email exists",
        });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//  login
router.patch("/", bodyparser.json(), async (req, res) => {
  try {
    const { email, password } = req.body;

    const eQuery = `SELECT * FROM users WHERE email = '${email}'`;
    connection.query(eQuery, async (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        const isMatch = await compare(password, results[0].password);
        if (isMatch === true) {
          const payload = {
            user: results[0],
          };
          // "/userid/posts/:postid"
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({
                results: payload.user,
                token,
                msg: "Login Successful",
              });
            }
          );
        } else {
          res.status(200).json({
            msg: "Incorrect Password",
          });
        }
      } else {
        res.status(200).json({
          msg: "Email not found",
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

// update user password
router.put("/:id/pass", async (req, res) => {
  try {
    const user = req.body;
    const query = `UPDATE users SET ? WHERE id = ${req.params.id}`;
    const payload = {
      password: user.password,
    };

    payload.password = await hash(user.password, 10);

    connection.query(query, payload, async (err, results) => {
      if (err) throw err;

      res.status(200).json({
        results,
        msg: "User Password Updated",
      });
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

// update user
router.put("/:id", async (req, res) => {
  try {
    const user = req.body;
    const query = `UPDATE users SET ? WHERE id = ${req.params.id}`;
    const payload = {
      fname: user.fname,
      email: user.email,
      profile: user.password,
    };
    connection.query(query, payload, async (err, results) => {
      if (err) throw err;

      res.status(200).json({
        results,
        msg: "User Details Updated",
      });
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

router.delete('/:id', (req, res) => {
    try {
        const query =`DELETE FROM users WHERE id = ${req.params.id}`;

        connection.query(query, (err, results) => {
            if (err) throw err;
            res.json({
                results,
                msg : "Deleted user"
            })
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
})

module.exports = router;
