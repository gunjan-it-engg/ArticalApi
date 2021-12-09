const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const Employee = require("../models/employe");
const auth = require("../middleware/auth");
const employe = new express.Router();
const EmployeeDetail = require("../models/employe-details");
const Adduser = require("../models/adduser");
const e = require("express");
// Adding Employee details inside app

employe.post("/adduser", async (req, res) => {
  try {
    const { name, lname, email, password, phone } = req.body.data;
    const emp = await new Adduser({
      name,
      lname,
      email,
      password,
      phone,
    }).save();
    emp.status(201).send({ emp });
  } catch (error) {
    console.log("Error", error);
    res.status(400).send(error.message);
  }
});

employe.post("/add", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      department,
      email,
      phone,
      gender,
      salary,
      country,
      state,
      dob,
    } = req.body.data;
    const existingEmp = await Employee.findOne({ email });
    if (existingEmp) {
      return res.status(400).send({ error: "Email already in use !" });
    }
    const empDetail = await new EmployeeDetail({
      department,
      salary: salary,
      country,
      state,
      // : gender,
    }).save();
    const emp = await new Employee({
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      // birth_place: birthPlace,
      // join_date: joinDate,
      // maritial_status: maritalStatus,
      // pan_card_no: panCardNumber,
      created_by: req.user._id,
      detail_ref: empDetail._id,
    }).save();

    res.status(201).send({ emp, empDetail });
  } catch (error) {
    console.log("Error ", error);
    res.status(400).send(error.message);
  }
});

//End-point for uploading an file
// const upload = multer({
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       cb(new Error("Please upload a Image"));
//     }
//     cb(undefined, true);
//   },
// });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const uploadImg = multer({ storage: storage }).single("image");

// employe.post(
//   "/img",
//   upload.single("avatar"),
//   async (req, res) => {
//     const buffer = await sharp(req.file.buffer)
//       .resize({ width: 250, height: 250 })
//       .png()
//       .toBuffer();
//     req.user.avatar = buffer;
//     req.user.avatar = req.file.buffer;
//     await req.user.save();
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send(error.message);
//   }
// );

const avatar = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image "));
    }
    cb(undefined, true);
  },
});

employe.post("/upload_img/:id", avatar.single("file"), async (req, res) => {
  try {
    console.log("request arrived");
    const buffer = await sharp(req.file.buffer)
      .resize(250, 250)
      .png()
      .toBuffer();
    // res.send({ buffer });
    // console.log("buffer", buffer);
    // const employee = await Employee.updateOne(
    //   { _id: req.query.empId },
    //   { $set: { displayImage: buffer } }
    // );
    console.log("req.query.empId)", req.query);
    const employee = await Employee.findById({ _id: req.params.id });
    employee.avatar = buffer;
    await employee.save();
    // console.log("bufferrr", new Buffer(buffer, "binary").toString("base64"));
    return res.send(employee);
  } catch (error) {
    console.log("Error gg ", error);
    res.status(400).send(error.message);
  }
});

// employe.get("/all", async (req, res) => {
//   try {
//     let { page, size } = req.query;
//     if (!page) {g
//       page = 1;
//     }
//     if (!size) {
//       size = 3;
//     }
//     const limit = parseInt(size);
//     const skip = (page - 1) * size;
//     // const users = await User.find().limit(limit).skip(skip);
//     const users = await Employee.find(
//       {},
//       {},
//       { limit: limit, skip: skip }
//     ).sort({ createdAt: -1 });
//     res.send(users);
//   } catch (error) {
//     console.log("Error", error);
//     res.sendStatus(500).send(error.message);
// try {
//   // finding something inside a model is time taking, so we need to add await
//   const users = await Employe.aggregate([
//     {
//       $sort: { createdAt: -1 },
//     },
//   ]);
//   res.status(200).json(users);
// } catch (error) {
//   res.status(404).json({ message: error.message });
// }
//   }
// });

employe.get("/all", async (req, res) => {
  //   try {
  //     let sortValue = -1;
  //     // if (req.query.type === "asc") {
  //     //   sortValue = -1;
  //     // }
  //     if (req.query.type === "des") {
  //       sortValue = 1;
  //     }

  //     let employees;
  //     if (req.query.q) {
  //       const query = req.query.q;
  //       var queryCond = {
  //         is_deleted: false,
  //       };
  //       if (query) {
  //         queryCond.firstName = { $regex: query, $options: "i" };
  //       }
  //       employees = await Employee.find(queryCond).sort({ createdAt: -1 });
  //     } else {
  //       employees = await Employee.find(
  //         { is_deleted: false },
  //         {},
  //         { limit: 3, skip: parseInt(req.query.skip ? req.query.skip : 0) }
  //       ).sort({ createdAt: sortValue });
  //     }
  //     const totalCounts = await Employee.count({ is_deleted: false });

  //     return res.status(200).send({ employees, totalCounts });
  //   } catch (error) {
  //     console.log("error", error);
  //     res.status(500).send({ error });
  //   }
  // });
  try {
    let employees;
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var query = {};
    let sortValue = -1;
    if (req.query.sortBy === "asc") {
      sortValue = -1;
    }
    if (req.query.sortBy === "des") {
      sortValue = 1;
    }
    if (pageNo < 0 || pageNo === 0) {
      pageNo = 1;
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    let search = req.query.searchText;
    let queries = [
      {
        $match: {
          is_deleted: false,
        },
      },
    ];
    if (search) {
      let expression = `^${req.query.searchText}`;
      queries.push({
        $match: {
          $or: [
            {
              firstName: {
                $regex: expression,
                $options: "i",
              },
            },
            {
              lastName: {
                $regex: expression,
                $options: "i",
              },
            },
            {
              email: {
                $regex: expression,
                $options: "i",
              },
            },
            {
              dob: {
                $regex: expression,
                $options: "i",
              },
            },
            {
              gender: {
                $regex: expression,
                $options: "i",
              },
            },
          ],
        },
      });
    }
    queries.push({ $sort: { createdAt: sortValue } });
    const resp = await Employee.aggregate(queries);
    return res.status(200).send({ resp });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

employe.get("/additonal_data", async (req, res) => {
  try {
    const _id = req.query["id"];

    const empDetails = await Employee.findOne({ _id }).populate("detail_ref");

    res.send(empDetails);
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error);
  }
});

// Editing the employe detaills
// employe.put("/:empId", async (req, res) => {
//   //   let user = await Employe.findById(req.params.id);
//   //   user = req.body;

//   //   const editUser = new Employe(user);
//   try {
//     // const user = await Employe.updateOne(
//     //   { id: req.params.id },
//     //   { ...req.body }
//     // );
//     const user = await Employee.findByIdAndUpdate(
//       req.params.empId,
//       {
//         ...req.body,
//       },
//       {
//         new: true,
//       }
//     );
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(409).json({ message: error.message });
//   }
// });
// update employee
employe.put("/edit", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,

      department,

      gender,
      phoneNumber,
      email,
      salary,

      country,
      state,
    } = req.body.data;
    const _id = req.query["id"];

    const empDetailRef = await Employee.findOne({ _id }).populate("detail_ref");

    const updatedDetail = await EmployeeDetail.findByIdAndUpdate(
      empDetailRef.detail_ref._id,
      {
        department,
        // phone: phoneNumber,
        salary: salary,
        country,
        state,
        // district,
        // zip_code: zipcode,
      },
      { new: true }
    );
    const updatedEmp = await Employee.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        email,
        dob,
        phone: phoneNumber,
        // birth_place: birthPlace,
        // join_date: joinDate,
        gender: gender,
        // maritial_status: maritalStatus,
        // pan_card_no: panCardNumber,

        detail_ref: updatedDetail._id,
      },
      { new: true }
    );

    res.status(202).send(updatedEmp);
  } catch (error) {
    console.log("error", error);
  }
});
// deleting the employee details
employe.delete("/:empId", auth, async (req, res) => {
  try {
    await Employee.deleteOne({ _id: req.params.empId });
    res.status(201).json("User deleted Successfully");
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
});

module.exports = employe;
