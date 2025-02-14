import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";

const FilterPatients = () => {
  return (
    <>
      <div
        className="filter"
        style={{
          border: "1px solid",
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
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              // value={formData.specialization}
              label="Age"
              name="age"
              // onChange={handleChange}
            >
              <MenuItem value={"one-to-ten"} selected>
                1 - 10
              </MenuItem>
              <MenuItem value={"eleven-to-twenty"}>11 - 20</MenuItem>
              <MenuItem value={"twentyone-to-thirty"}>21 - 30</MenuItem>
              <MenuItem value={"thirtyone-to-forty"}>31 - 40</MenuItem>
              <MenuItem value={"fortyone-to-fifty"}>41 - 50</MenuItem>
              <MenuItem value={"fiftyone-to-sixty"}>51 - 60</MenuItem>
              <MenuItem value={"sixtyone-to-seventy"}>61 - 70</MenuItem>
              <MenuItem value={"seventyone-to-eighty"}>71 - 80</MenuItem>
              <MenuItem value={"eightyone-to-ninety"}>81 - 90</MenuItem>
              <MenuItem value={"ninetyone-to-onehundred"}>91 - 100</MenuItem>
              <MenuItem value={"onehundredone-to-onehundredandten"}>
                101 - 110
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl
            sx={{ width: "200px", marginTop: "-20px", marginLeft: "20px" }}
          >
            <InputLabel id="demo-simple-select-helper-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              // value={formData.specialization}
              label="Gender"
              name="gender"
              // onChange={handleChange}
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
            id="outlined-basic"
            label="Start date"
            variant="outlined"
            type="date"
            style={{ marginLeft: "20px", marginBottom: "20px" }}
            InputLabelProps={{
              shrink: true, // This removes the default dd-mm-yyyy placeholder
            }}
          />
          <TextField
            id="outlined-basic"
            label="End date"
            variant="outlined"
            type="date"
            style={{ marginLeft: "20px", marginBottom: "20px" }}
            InputLabelProps={{
              shrink: true, // This removes the default dd-mm-yyyy placeholder
            }}
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
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPatients;
