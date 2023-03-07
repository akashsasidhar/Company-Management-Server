import express from "express";
import { pool } from "../dbConnection/db_init.js";
import { locateAddress } from "../utils/geo_locator.js";

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const [rows] = await pool.query("select * from company_details");
    if (rows.length > 0) {
      console.log("Company Listed Successfully");
      res.status(200).send({
        message: "Success",
        status: 200,
        data: rows,
      });
    } else {
      console.log("There is no company details in the database");
      res.status(200).send({
        message: "Success",
        status: 404,
        data: "Sorry we haven't found any company details in the database",
      });
    }
    return rows;
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at api/company/list ${error} `);
  }
});

router.get("/search/:id", async (req, res, next) => {
  try {
    const companyId = req.params.id;

    const [rows] = await pool.query(
      "select * from company_details where id=?",
      [companyId]
    );
    if (rows.length > 0) {
      res.status(200).send({
        message: "Success",
        status: 200,
        data: rows[0],
      });
    } else {
      res.status(200).send({
        message: "Company not found",
        status: 404,
        data: [],
      });
    }
    return rows;
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at api/company/:id ${error} `);
  }
});

router.post("/create", async (req, res) => {
  try {
    let data = [];
    let latitude;
    let longitude;
    let state;
    let country;
    // Retrieve the company data from the request body
    const { name, company_address } = req.body;
    data = await locateAddress(req.body.company_address);

    if (data.length > 0) {
      latitude = data[0].latitude;
      longitude = data[0].longitude;
      state = data[0].state;
      country = data[0].country;
    } else {
      latitude = "";
      longitude = "";
      state = "";
      country = "";
      console.log("No data available.");
    }

    //   const record = req.body;
    const query = `
  INSERT INTO company_details (name, company_address, latitude, longitude, state, country)
  VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    company_address = VALUES(company_address)`;
    const result = await pool.query(
      query,
      [name, company_address, latitude, longitude, state, country],
      (error, results, fields) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Record inserted successfully.");
        }
      }
    );
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
    console.log(`Error at at api/company/create ${error} `);
  }
});

router.put("/addUser", async (req, res, next) => {
  try {
    const { user, id } = req.body;
    const result = await pool.query(
      "update company_details set user=? where id=? ",
      [user, id]
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
    console.log(`Error at api/company/addUser ${error} `);
  }
});

router.put("/deleteUser", async (req, res, next) => {
  try {
    const { id } = req.body;
    const result = await pool.query(
      "update company_details set user='' where id=? ",
      [id]
    );
    if (result) {
      console.log("User Deleted Successfully");
      res.status(200).send({
        message: "User Deleted Successfully",
        status: 200,
      });
    }
    return result;
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at api/company/deleteUser ${error} `);
  }
});

router.post("/deleteCompany", async function (req, res) {
  try {
    const { id } = req.body;
    console.log(req.body);
    console.log(id);
    const result = await pool.query("delete from company_details where id=? ", [
      id,
    ]);
    if (result) {
      console.log("Company Deleted Successfully");
      res.status(200).send({
        message: "Company Deleted Successfully",
        status: 200,
        companyId: id,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at api/company/deleteCompany ${error} `);
  }
});

router.get("/selectList/:id", async (req, res, next) => {
  try {
    const companyId = req.params.id;
    console.log(companyId, "id");
    const [rows] = await pool.query(
      "select * from company_details where not id=?",
      [companyId]
    );
    if (rows.length > 0) {
      console.log("Company Listed Successfully");
      res.status(200).send({
        message: "Success",
        status: 200,
        data: rows,
      });
    } else {
      console.log("There is no company details in the database");
      res.status(200).send({
        message: "Success",
        status: 404,
        data: "Sorry we haven't found any company details in the database",
      });
    }
    return rows;
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
    console.log(`Error at api/company/selectList/:id ${error} `);
  }
});

export default router;
