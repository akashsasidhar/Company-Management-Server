import express from "express";
import { pool } from "../dbConnection/db_init.js";

const router = express.Router();
router.get("/list/:companyId", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "select * from user_details where company_id=?",
      [req.params.companyId]
    );
    if (rows.length > 0) {
      console.log("User Listed Successfully");
      res.status(200).send({
        message: "Success",
        status: 200,
        data: rows,
      });
    } else {
      console.log("There is no user details present in the database");
      res.status(200).send({
        message: "Success",
        status: 404,
        data: "Sorry we haven't found any user details present in the database",
      });
    }
    return rows;
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at api/user/list ${error} `);
  }
});

router.get("/search/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const [rows] = await pool.query(
      "select * from user_details where userid=?",
      [userId]
    );
    if (rows.length > 0) {
      res.status(200).send({
        message: "Success",
        status: 200,
        data: rows[0],
      });
    } else {
      res.status(200).send({
        message: "User not found",
        status: 404,
        data: "Sorry we haven't found the given user id present in the database",
      });
    }

    return rows[0];
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at api/user/search/:id ${error} `);
  }
});

router.post("/create", async (req, res) => {
  try {
    // Retrieve the company data from the request body
    const { firstName, lastName, email, designation, dob, companyId } =
      req.body;

    //   const record = req.body;
    const query = `
  INSERT INTO user_details (first_name, last_name, email, designation, date_of_birth,company_id)
  VALUES (?, ?, ?, ?,?,?)`;
    const result = await pool.query(query, [
      firstName,
      lastName,
      email,
      designation,
      dob,
      companyId,
    ]);
    if (result) {
      console.log("Record inserted successfully.");
      res.status(200).send({
        message: "Record Inserted Successfully",
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at at api/user/create ${error} `);
  }
});

router.put("/updateUser", async (req, res, next) => {
  try {
    const { firstName, lastName, email, designation, dob, id } = req.body;
    const result = await pool.query(
      "update user_details set first_name=?, last_name=?, email=?, designation=?, dob=? where userid=? ",
      [firstName, lastName, email, designation, id]
    );
    if (result) {
      console.log("User Updated Successfully");
      res.status(200).send({
        message: "User Updated Successfully",
        status: 200,
      });
    }
    return result;
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at api/user/updateUser ${error} `);
  }
});

router.put("/updateUserStatus", async (req, res, next) => {
  try {
    const { id, isActive } = req.body;
    const result = await pool.query(
      "update user_details set active=? where userid=? ",
      [isActive, id]
    );
    if (result) {
      console.log(
        isActive
          ? "User Activated Successfully"
          : "User Deactivated Successfully"
      );
      res.status(200).send({
        message: isActive
          ? "User Activated Successfully"
          : "User Deactivated Successfully",
        status: 200,
      });
    }
    return result;
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at api/user/updateUser ${error} `);
  }
});

router.delete("/deleteUser", async function (req, res) {
  try {
    const { id } = req.body;
    const result = await pool.query(
      "delete from user_details where userid=? ",
      [id]
    );
    if (result) {
      console.log("User Deleted Successfully");
      res.status(200).send({
        message: "User Deleted Successfully",
        status: 200,
        companyId: id,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at api/company/deleteUser ${error} `);
  }
});

router.put("/migrateUser", async (req, res, next) => {
  try {
    const { companyId, userId } = req.body;
    const result = await pool.query(
      "update user_details set company_id=? where userid=? ",
      [companyId, userId]
    );
    if (result) {
      console.log("User Migrated Successfully");
      res.status(200).send({
        message: "User Migrated Successfully",
        status: 200,
      });
    }
    return result;
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at api/user/migrateUser ${error} `);
  }
});
export default router;
