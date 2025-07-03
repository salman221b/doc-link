import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";

const FilterPatients = ({ allPatients, onFilter }) => {
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  useEffect(() => {
    let filtered = [...allPatients];

    if (age) {
      const [min, max] = age.split("-").map(Number);
      filtered = filtered.filter(
        (p) => p.patientId.age >= min && p.patientId.age <= max
      );
    }

    if (gender) {
      filtered = filtered.filter((p) => p.patientId.gender === gender);
    }

    onFilter(filtered); // Pass the full appointment with patientId populated
  }, [age, gender]);

  const handleDateFilter = () => {
    let filtered = [...allPatients];

    if (age) {
      const [min, max] = age.split("-").map(Number);
      filtered = filtered.filter(
        (p) => p.patientId.age >= min && p.patientId.age <= max
      );
    }

    if (gender) {
      filtered = filtered.filter((p) => p.patientId.gender === gender);
    }

    if (startDate) {
      filtered = filtered.filter(
        (p) => new Date(p.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (p) => new Date(p.createdAt) <= new Date(endDate)
      );
    }

    onFilter(filtered);
  };
  return (
    <>
      <div
        className="filter"
        style={{
          border: "1px solid #82EAAC",
          borderRadius: "10px",

          paddingRight: "20px",
          paddingTop: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            // borderRadius: "10px",
            // border: "1px solid #030E82",
            // padding: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <FormControl
            sx={{ width: "200px", marginTop: "-20px", marginLeft: "20px" }}
          >
            <InputLabel id="demo-simple-select-helper-label">Age</InputLabel>
            <Select
              style={{ backgroundColor: "white", borderRadius: "10px" }}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              // value={formData.specialization}
              label="Age"
              name="age"
              onChange={(e) => setAge(e.target.value)}
            >
              <MenuItem value={"1-10"} selected>
                1 - 10
              </MenuItem>
              <MenuItem value={"11-20"}>11 - 20</MenuItem>
              <MenuItem value={"21-30"}>21 - 30</MenuItem>
              <MenuItem value={"31-40"}>31 - 40</MenuItem>
              <MenuItem value={"41-50"}>41 - 50</MenuItem>
              <MenuItem value={"51-60"}>51 - 60</MenuItem>
              <MenuItem value={"61-70"}>61 - 70</MenuItem>
              <MenuItem value={"71-80"}>71 - 80</MenuItem>
              <MenuItem value={"81-90"}>81 - 90</MenuItem>
              <MenuItem value={"91-100"}>91 - 100</MenuItem>
              <MenuItem value={"101-110"}>101 - 110</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            sx={{ width: "200px", marginTop: "-20px", marginLeft: "20px" }}
          >
            <InputLabel id="demo-simple-select-helper-label">Gender</InputLabel>
            <Select
              style={{ backgroundColor: "white", borderRadius: "10px" }}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              // value={formData.specialization}
              label="Gender"
              name="gender"
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value={"male"} selected>
                Male
              </MenuItem>
              <MenuItem value={"female"}>Female</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div
          style={{
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            // borderRadius: "10px",
            // border: "1px solid #030E82",
            // padding: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <TextField
            style={{
              marginLeft: "20px",
              marginBottom: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
            id="outlined-basic"
            label="Start date"
            variant="outlined"
            type="date"
            InputLabelProps={{
              shrink: true, // This removes the default dd-mm-yyyy placeholder
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            style={{
              marginLeft: "20px",
              marginBottom: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
            id="outlined-basic"
            label="End date"
            variant="outlined"
            type="date"
            InputLabelProps={{
              shrink: true, // This removes the default dd-mm-yyyy placeholder
            }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            className="searchButton"
            type="submit"
            style={{
              marginLeft: "20px",
              marginBottom: "20px",
              backgroundColor: "#82EAAC",
              color: "#030E82",
              height: "50px",
              width: "100px",
              borderRadius: "10px",
            }}
            onClick={handleDateFilter}
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPatients;
