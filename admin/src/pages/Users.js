import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ApproveOutlinedIcon from "@mui/icons-material/BeenhereOutlined";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useState } from "react";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const tableData = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 3,
      name: "James Smith",
      email: "james.smith@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 4,
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 6,
      name: "Sarah Lee",
      email: "sarah.lee@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 7,
      name: "Kevin White",
      email: "kevin.white@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 8,
      name: "Lisa Nguyen",
      email: "lisa.nguyen@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 9,
      name: "David Kim",
      email: "david.kim@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 10,
      name: "Olivia Martin",
      email: "olivia.martin@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 11,
      name: "Alexander Hall",
      email: "alexander.hall@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 12,
      name: "Samantha Taylor",
      email: "samantha.taylor@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 13,
      name: "Gabriel Davis",
      email: "gabriel.davis@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 14,
      name: "Mia Garcia",
      email: "mia.garcia@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 15,
      name: "Benjamin Lewis",
      email: "benjamin.lewis@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 16,
      name: "Eva Rodriguez",
      email: "eva.rodriguez@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 17,
      name: "Julian Walker",
      email: "julian.walker@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 18,
      name: "Ava Mitchell",
      email: "ava.mitchell@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 19,
      name: "Liam Brooks",
      email: "liam.brooks@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 20,
      name: "Sophia Jenkins",
      email: "sophia.jenkins@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 21,
      name: "Caleb Martin",
      email: "caleb.martin@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 22,
      name: "Isabella Brown",
      email: "isabella.brown@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 23,
      name: "Lucas Davis",
      email: "lucas.davis@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 24,
      name: "Charlotte Lee",
      email: "charlotte.lee@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 25,
      name: "Hannah Hall",
      email: "hannah.hall@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 26,
      name: "Elijah Taylor",
      email: "elijah.taylor@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 27,
      name: "Abigail Martin",
      email: "abigail.martin@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 28,
      name: "Oliver White",
      email: "oliver.white@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
    {
      id: 29,
      name: "Ava Smith",
      email: "ava.smith@example.com",
      contact: "1234567890",
      status: "Approved",
      role: "Doctor",
    },
    {
      id: 30,
      name: "Isaac Johnson",
      email: "isaac.johnson@example.com",
      contact: "9876543210",
      status: "Pending",
      role: "Patient",
    },
  ];
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = tableData.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <div>
      <h1 className="title">All Users</h1>
      <form>
        <div
          className="searchArea "
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px",
          }}
        >
          <FormControl sx={{ width: "200px", marginTop: "-20px" }}>
            <InputLabel id="demo-simple-select-helper-label">
              Search By
            </InputLabel>
            <Select
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginTop: "20px",
              }}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              // value={formData.specialization}
              label="Search By"
              name="search_by"
              // onChange={handleChange}
            >
              <MenuItem value={"in-person"} selected>
                E mail
              </MenuItem>
              <MenuItem value={"video-consultation"}>User ID</MenuItem>
              <MenuItem value={"tele-consultation"}>Contact No.</MenuItem>
            </Select>
            {/* <FormHelperText>With label + helper text</FormHelperText> */}
          </FormControl>
          <div
            className="searchById"
            style={{
              // display: "flex",
              // justifyContent: "center",
              // alignItems: "center",
              borderRadius: "10px",
              border: "1px solid ",
              borderColor: "#82EAAC",

              padding: "5px",
              width: "300px",
              margin: "0 auto",
            }}
          >
            <input
              className="text"
              type="text"
              placeholder="Enter User ID or E mail"
              style={{
                width: "200px",
                border: "none",
                outline: "none",
                padding: "5px",
                // color: "#030E82",
                fontSize: "15px",
                fontWeight: "bold",
                //   marginRight: "10px",
                //   marginLeft: "10px",
                //   marginTop: "5px",
                //   marginBottom: "5px",
                backgroundColor: "transparent",
                borderRadius: "5px",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0)",
                textAlign: "center",
              }}
            />
            <ArrowForwardIcon
              className="input"
              style={{
                color: "#82EAAC",
                fontSize: "30px",
                float: "right",
                margin: "2px",
                cursor: "pointer",
                // backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderRadius: "5px",
              }}
            />
          </div>

          <FormControl sx={{ width: "200px", marginTop: "-20px" }}>
            <InputLabel id="demo-simple-select-helper-label">
              Sort By
            </InputLabel>
            <Select
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginTop: "20px",
                marginRight: "10px",
              }}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              // value={formData.specialization}
              label="Sort By"
              name="sort_by"
              // onChange={handleChange}
            >
              <MenuItem value={"in-person"} selected>
                Newer to Older
              </MenuItem>
              <MenuItem value={"video-consultation"}>Older to Newer</MenuItem>
              <MenuItem value={"tele-consultation"}>Name</MenuItem>
              <MenuItem value={"tele-consultation"}>Status</MenuItem>
              <MenuItem value={"tele-consultation"}>Rating</MenuItem>
            </Select>
            {/* <FormHelperText>With label + helper text</FormHelperText> */}
          </FormControl>
          <FormControl sx={{ width: "200px", marginTop: "-20px" }}>
            <InputLabel id="demo-simple-select-helper-label">
              Role Based
            </InputLabel>
            <Select
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginLeft: "10px",
                marginTop: "20px",
              }}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              // value={formData.specialization}
              label="Role Based"
              name="role_based"
              // onChange={handleChange}
            >
              <MenuItem value={"in-person"} selected>
                Doctors
              </MenuItem>
              <MenuItem value={"video-consultation"}>Patients</MenuItem>
            </Select>
            {/* <FormHelperText>With label + helper text</FormHelperText> */}
          </FormControl>
        </div>
      </form>

      {/* __________________________________Table__________________________________________________________________________________ */}
      <div
        className="table-container"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <table className="custom-table">
          <thead>
            <tr>
              <th className="th">User ID</th>
              <th className="th">Name</th>
              <th className="th">Email</th>
              <th className="th">Contact No.</th>
              <th className="th">Status</th>
              <th className="th">Role</th>
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr>
                <td className="td" key={index}>
                  {item.id}
                </td>
                <td className="td">{item.name}</td>
                <td className="td">{item.email}</td>
                <td className="td">{item.contact}</td>
                <td className="td">{item.status}</td>
                <td className="td">{item.role}</td>
                <td className="td">
                  <button
                    className="button"
                    style={{
                      color: "blue",
                      backgroundColor: "transparent",
                      border: "none",
                      margin: "3px",
                    }}
                  >
                    <EditOutlinedIcon />
                  </button>
                  <button
                    className="button"
                    style={{
                      color: "red",
                      backgroundColor: "transparent",
                      border: "none",
                      margin: "3px",
                    }}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </button>
                  <button
                    className="button"
                    style={{
                      color: "green",
                      backgroundColor: "transparent",
                      border: "none",
                      margin: "3px",
                    }}
                  >
                    <ApproveOutlinedIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}

        <div style={{ float: "right", marginTop: "30px", marginRight: "20px" }}>
          <button
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#7D87E0",
            }}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ArrowBackIosIcon />
          </button>

          <span>
            {" "}
            Page {currentPage} of {totalPages}{" "}
          </span>

          <button
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#7D87E0",
            }}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
