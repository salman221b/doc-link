import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ApproveOutlinedIcon from "@mui/icons-material/BeenhereOutlined";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useState } from "react";
const Appointments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const tableData = [
    {
      slno: 1,
      appointmentId: "APM001",
      doctorName: "Dr. John Doe",
      patientName: "John Smith",
      doctorEmail: "john.doe@example.com",
      patientContact: "9876543210",
      status: "Scheduled",
    },
    {
      slno: 2,
      appointmentId: "APM002",
      doctorName: "Dr. Jane Doe",
      patientName: "Jane Doe",
      doctorEmail: "jane.doe@example.com",
      patientContact: "1234567890",
      status: "Approved",
    },
    {
      slno: 3,
      appointmentId: "APM003",
      doctorName: "Dr. James Smith",
      patientName: "James Johnson",
      doctorEmail: "james.smith@example.com",
      patientContact: "9876543210",
      status: "Cancelled",
    },
    {
      slno: 4,
      appointmentId: "APM004",
      doctorName: "Dr. Emily Johnson",
      patientName: "Emily Johnson",
      doctorEmail: "emily.johnson@example.com",
      patientContact: "1234567890",
      status: "Scheduled",
    },
    {
      slno: 5,
      appointmentId: "APM005",
      doctorName: "Dr. Michael Brown",
      patientName: "Michael Brown",
      doctorEmail: "michael.brown@example.com",
      patientContact: "9876543210",
      status: "Approved",
    },
    {
      slno: 6,
      appointmentId: "APM006",
      doctorName: "Dr. Sarah Lee",
      patientName: "Sarah Lee",
      doctorEmail: "sarah.lee@example.com",
      patientContact: "1234567890",
      status: "Cancelled",
    },
    {
      slno: 7,
      appointmentId: "APM007",
      doctorName: "Dr. Kevin White",
      patientName: "Kevin White",
      doctorEmail: "kevin.white@example.com",
      patientContact: "9876543210",
      status: "Scheduled",
    },
    {
      slno: 8,
      appointmentId: "APM008",
      doctorName: "Dr. Lisa Nguyen",
      patientName: "Lisa Nguyen",
      doctorEmail: "lisa.nguyen@example.com",
      patientContact: "1234567890",
      status: "Approved",
    },
    {
      slno: 9,
      appointmentId: "APM009",
      doctorName: "Dr. David Kim",
      patientName: "David Kim",
      doctorEmail: "david.kim@example.com",
      patientContact: "9876543210",
      status: "Cancelled",
    },
    {
      slno: 10,
      appointmentId: "APM010",
      doctorName: "Dr. Olivia Martin",
      patientName: "Olivia Martin",
      doctorEmail: "olivia.martin@example.com",
      patientContact: "1234567890",
      status: "Scheduled",
    },
    {
      slno: 11,
      appointmentId: "APM011",
      doctorName: "Dr. Alexander Hall",
      patientName: "Alexander Hall",
      doctorEmail: "alexander.hall@example.com",
      patientContact: "9876543210",
      status: "Approved",
    },
    {
      slno: 12,
      appointmentId: "APM012",
      doctorName: "Dr. Samantha Taylor",
      patientName: "Samantha Taylor",
      doctorEmail: "samantha.taylor@example.com",
      patientContact: "1234567890",
      status: "Cancelled",
    },
    {
      slno: 13,
      appointmentId: "APM013",
      doctorName: "Dr. Gabriel Davis",
      patientName: "Gabriel Davis",
      doctorEmail: "gabriel.davis@example.com",
      patientContact: "9876543210",
      status: "Scheduled",
    },
    {
      slno: 14,
      appointmentId: "APM014",
      doctorName: "Dr. Mia Garcia",
      patientName: "Mia Garcia",
      doctorEmail: "mia.garcia@example.com",
      patientContact: "1234567890",
      status: "Approved",
    },
    {
      slno: 15,
      appointmentId: "APM015",
      doctorName: "Dr. Benjamin Lewis",
      patientName: "Benjamin Lewis",
      doctorEmail: "benjamin.lewis@example.com",
      patientContact: "9876543210",
      status: "Cancelled",
    },
    {
      slno: 16,
      appointmentId: "APM016",
      doctorName: "Dr. Eva Rodriguez",
      patientName: "Eva Rodriguez",
      doctorEmail: "eva.rodriguez@example.com",
      patientContact: "1234567890",
      status: "Scheduled",
    },
    {
      slno: 17,
      appointmentId: "APM017",
      doctorName: "Dr. Julian Walker",
      patientName: "Julian Walker",
      doctorEmail: "julian.walker@example.com",
      patientContact: "9876543210",
      status: "Approved",
    },
    {
      slno: 18,
      appointmentId: "APM018",
      doctorName: "Dr. Ava Mitchell",
      patientName: "Ava Mitchell",
      doctorEmail: "ava.mitchell@example.com",
      patientContact: "1234567890",
      status: "Cancelled",
    },
    {
      slno: 19,
      appointmentId: "APM019",
      doctorName: "Dr. Liam Brooks",
      patientName: "Liam Brooks",
      doctorEmail: "liam.brooks@example.com",
      patientContact: "9876543210",
      status: "Scheduled",
    },
    {
      slno: 20,
      appointmentId: "APM020",
      doctorName: "Dr. Sophia Jenkins",
      patientName: "Sophia Jenkins",
      doctorEmail: "sophia.jenkins@example.com",
      patientContact: "1234567890",
      status: "Approved",
    },
    {
      slno: 21,
      appointmentId: "APM021",
      doctorName: "Dr. Caleb Martin",
      patientName: "Caleb Martin",
      doctorEmail: "caleb.martin@example.com",
      patientContact: "9876543210",
      status: "Cancelled",
    },
    {
      slno: 22,
      appointmentId: "APM022",
      doctorName: "Dr. Isabella Brown",
      patientName: "Isabella Brown",
      doctorEmail: "isabella.brown@example.com",
      patientContact: "1234567890",
      status: "Scheduled",
    },
    {
      slno: 23,
      appointmentId: "APM023",
      doctorName: "Dr. Lucas Davis",
      patientName: "Lucas Davis",
      doctorEmail: "lucas.davis@example.com",
      patientContact: "9876543210",
      status: "Approved",
    },
    {
      slno: 24,
      appointmentId: "APM024",
      doctorName: "Dr. Charlotte Lee",
      patientName: "Charlotte Lee",
      doctorEmail: "charlotte.lee@example.com",
      patientContact: "1234567890",
      status: "Cancelled",
    },
    {
      slno: 25,
      appointmentId: "APM025",
      doctorName: "Dr. Hannah Hall",
      patientName: "Hannah Hall",
      doctorEmail: "hannah.hall@example.com",
      patientContact: "9876543210",
      status: "Scheduled",
    },
    {
      slno: 26,
      appointmentId: "APM026",
      doctorName: "Dr. Elijah Taylor",
      patientName: "Elijah Taylor",
      doctorEmail: "elijah.taylor@example.com",
      patientContact: "1234567890",
      status: "Approved",
    },
    {
      slno: 27,
      appointmentId: "APM027",
      doctorName: "Dr. Abigail Martin",
      patientName: "Abigail Martin",
      doctorEmail: "abigail.martin@example.com",
      patientContact: "9876543210",
      status: "Cancelled",
    },
    {
      slno: 28,
      appointmentId: "APM028",
      doctorName: "Dr. Oliver White",
      patientName: "Oliver White",
      doctorEmail: "oliver.white@example.com",
      patientContact: "1234567890",
      status: "Scheduled",
    },
    {
      slno: 29,
      appointmentId: "APM029",
      doctorName: "Dr. Ava Smith",
      patientName: "Ava Smith",
      doctorEmail: "ava.smith@example.com",
      patientContact: "9876543210",
      status: "Approved",
    },
    {
      slno: 30,
      appointmentId: "APM030",
      doctorName: "Dr. Isaac Johnson",
      patientName: "Isaac Johnson",
      doctorEmail: "isaac.johnson@example.com",
      patientContact: "1234567890",
      status: "Cancelled",
    },
  ];
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = tableData.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <div>
      <h1 className="title">All Appointments</h1>
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
                Appointment ID
              </MenuItem>
              <MenuItem value={"video-consultation"}>Doctor Email ID</MenuItem>
              <MenuItem value={"tele-consultation"}>
                Patient Contact No.
              </MenuItem>
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
              <MenuItem value={"tele-consultation"}>Status</MenuItem>
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
              <th className="th">Sl No.</th>
              <th className="th">Appointment ID</th>
              <th className="th">Doctor Name</th>
              <th className="th">Patient Name</th>
              <th className="th">Doctor Email</th>
              <th className="th">Patient Contact</th>
              <th className="th">Status</th>
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr>
                <td className="td">{item.slno}</td>

                <td className="td" key={index}>
                  {item.appointmentId}
                </td>
                <td className="td">{item.doctorName}</td>
                <td className="td">{item.patientName}</td>
                <td className="td">{item.doctorEmail}</td>
                <td className="td">{item.patientContact}</td>
                <td className="td">{item.status}</td>
                <td className="td">
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

export default Appointments;
