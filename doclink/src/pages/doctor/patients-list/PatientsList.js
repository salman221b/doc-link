import React from "react";
import NavBar from "../../../components/doctorNavbar/NavBar";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { blue } from "@mui/material/colors";
import FilterPatients from "../../../components/filter/FilterPatients";
import CloseIcon from "@mui/icons-material/Close";

const PatientsList = () => {
  const [filter, setFilter] = React.useState(false);
  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Practice,</h1>
      <h1 className="title2"> Simplified.</h1>
      <p style={{ color: "#030E82", fontSize: "1rem", fontStyle: "italic" }}>
        Manage your appointments, patients, and medical records with ease.
      </p>

      <div className="search-area" style={{ marginTop: "50px" }}>
        <form>
          <div
            className="searchArea"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl sx={{ width: "200px", marginTop: "-20px" }}>
              <InputLabel id="demo-simple-select-helper-label">
                Search By
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                // value={formData.specialization}
                label="Search By"
                name="search-by"
                // onChange={handleChange}
              >
                <MenuItem value={"name"} selected>
                  Name
                </MenuItem>
                <MenuItem value={"id"}>ID</MenuItem>
                <MenuItem value={"contact-no"}>Contact No.</MenuItem>
              </Select>
            </FormControl>
            <div
              className="searchById"
              style={{
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                borderRadius: "10px",
                border: "1px solid #030E82",
                padding: "5px",
                width: "300px",
                // margin: "0 auto",
                marginLeft: "20px",
                marginTop: "-20px",
              }}
            >
              <input
                type="text"
                placeholder="Enter ID "
                style={{
                  width: "75%",
                  border: "none",
                  outline: "none",
                  padding: "5px",
                  color: "#030E82",
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
                style={{
                  color: "#82EAAC",
                  fontSize: "30px",
                  float: "right",
                  margin: "2px",
                  cursor: "pointer",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "5px",
                }}
              />
            </div>
            <FormControl
              sx={{ width: "200px", marginTop: "-20px", marginLeft: "20px" }}
            >
              <InputLabel id="demo-simple-select-helper-label">
                Sort By
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                // value={formData.specialization}
                label="Sort By"
                name="sort-by"
                // onChange={handleChange}
              >
                <MenuItem value={"name"} selected>
                  Name
                </MenuItem>
                <MenuItem value={"last-visit"}>Last Visit</MenuItem>
                <MenuItem value={"appointment-date"}>Appointment Date</MenuItem>
              </Select>
            </FormControl>
          </div>
        </form>
        <hr />
        <p
          style={{
            textDecoration: "underline",
            color: blue[500],
            cursor: "pointer",
          }}
          onClick={() => setFilter(!filter)}
        >
          Filters:
        </p>

        <CloseIcon
          style={{
            color: "red",
            float: "right",
            cursor: "pointer",
            display: filter ? "block" : "none",
          }}
          onClick={() => setFilter(false)}
        />
        {filter && <FilterPatients />}
      </div>
    </div>
  );
};

export default PatientsList;
