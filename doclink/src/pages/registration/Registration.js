import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import PasswordField from "../../components/passwordField";
import logo from "../../static/DocLink_Logo_Bg.png";
import LoadingScreen from "../../components/loadingScreen/LoadingScreen";
import CustomizedSwitches from "../../components/theme/Theme";
const Registration = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    state: "",
    district: "",
    password: "",
    confirmPassword: "",
    role: "",
    medicalLicenseNumber: "",
    specialization: [],
    qualification: [],
    yearOfExperience: "",
    hospitalName: "",
    registrationAuthority: "",
    registrationNumber: "",
    consultationFee: {
      inPerson: "",
      video: "",
      teleconsultation: "",
    },
    availableConsultations: {
      inPerson: false,
      video: false,
      teleconsultation: false,
    },
    availabilitySchedule: {
      monday: {
        available: true,
        startTime: "",
        endTime: "",
      },
      tuesday: {
        available: true,
        startTime: "",
        endTime: "",
      },
      wednesday: {
        available: true,
        startTime: "",
        endTime: "",
      },
      thursday: {
        available: true,
        startTime: "",
        endTime: "",
      },
      friday: {
        available: true,
        startTime: "",
        endTime: "",
      },
      saturday: {
        available: false,
        startTime: "",
        endTime: "",
      },
      sunday: {
        available: false,
        startTime: "",
        endTime: "",
      },
    },
    clinicAddress: "",

    language: [],
    shortBio: "",
    profileLinks: {
      website: "",
      linkedin: "",
    },
    agreed: false,
  });
  const [files, setFiles] = useState({
    medicalLicenseDocument: null,
    degreeCertificate: null,
    governmentIdProof: null,
  });
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const validate = () => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = "First Name is required";
    if (!formData.lastName) tempErrors.lastName = "Last Name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is not valid";
    }
    if (!formData.age) {
      tempErrors.age = "Age is required";
    } else if (formData.age <= 1 || formData.age >= 150) {
      tempErrors.age = "Age is not valid, Age should be between 2 and 150";
    }
    if (formData.phone.length < 10 || formData.phone.length > 10) {
      tempErrors.phone = "Phone number is not valid";
    }
    if (formData.gender === "") {
      tempErrors.gender = "Gender is required";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (!pattern.test(formData.password)) {
      tempErrors.password =
        "Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one special character.";
    }
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.agreed === false) {
      tempErrors.agreed = "You must agree to the terms and conditions";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Returns true if no errors
  };

  const updateNestedField = (name, value) => {
    const keys = name.split(".");
    setFormData((prev) => {
      let updated = { ...prev };
      let pointer = updated;

      // Traverse to the key path
      for (let i = 0; i < keys.length - 1; i++) {
        pointer[keys[i]] = { ...pointer[keys[i]] };
        pointer = pointer[keys[i]];
      }

      // Handle multiple selection for fields like qualification
      const lastKey = keys[keys.length - 1];
      if (Array.isArray(pointer[lastKey])) {
        // If value is already in array, remove it; otherwise, add it
        const newValue = pointer[lastKey].includes(value)
          ? pointer[lastKey].filter((item) => item !== value)
          : [...pointer[lastKey], value];
        pointer[lastKey] = newValue;
      } else {
        // Update the target value normally
        pointer[lastKey] = value;
      }

      return updated;
    });
  };

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;

    if (type === "checkbox") {
      updateNestedField(name, checked);
    } else if (event.target.multiple) {
      // Handle multiple selection in <Select>
      const selectedValues = Array.from(
        event.target.selectedOptions,
        (option) => option.value
      );
      updateNestedField(name, selectedValues);
    } else {
      updateNestedField(name, value);
    }
  };
  const handleRemoveItem = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };

  // Unified File Upload Handler
  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: files[0], // Save the first selected file
    }));
  };

  // Submit Form
  const handleSubmitDoctor = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        //  Convert arrays (qualification, specialization, languages) to JSON
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (typeof formData[key] === "object") {
        formDataToSend.append(key, JSON.stringify(formData[key])); // Handle nested objects
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    // Append files
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        formDataToSend.append(key, files[key]);
      }
    });

    if (validate()) {
      const url = "https://doc-link-backend.onrender.com/registerdoctor";

      try {
        const response = await fetch(url, {
          method: "POST",

          body: formDataToSend,
        });
        if (!response.ok) {
          const errorData = await response.json(); // Parse error message from the backend
          throw new Error(errorData.errorMessage || "Registration failed");
        }

        const responseData = await response.json(); // Parse successful response data
        console.log("Registration successful:", responseData);
        setErrorMessage(""); // Clear error message on success
        navigate("/verify_email", {
          state: { email: formData.email, role: "doctor", type: "register" },
        });
      } catch (error) {
        console.error("Error during registration:", error.message);

        // Display error message to the user
        setErrorMessage(
          error.message || "An unexpected error occurred. Please try again."
        );
      } finally {
        setLoading(false); // Stop loading after request
      }
    } else {
      console.log("Validation failed");
      setLoading(false);
    }
  };
  const handleSubmitPatient = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (validate()) {
      try {
        const response = await fetch(
          "https://doc-link-backend.onrender.com/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json(); // Parse error message from the backend
          throw new Error(errorData.errorMessage || "Registration failed");
        }

        const responseData = await response.json(); // Parse successful response data
        console.log("Registration successful:", responseData);
        setErrorMessage(""); // Clear error message on success
        navigate("/verify_email", {
          state: { email: formData.email, role: "patient", type: "register" },
        });
      } catch (error) {
        console.error("Error during registration:", error.message);

        // Display error message to the user
        setErrorMessage(
          error.message || "An unexpected error occurred. Please try again."
        );
      } finally {
        setLoading(false); // Stop loading after request
      }
    } else {
      console.log("Validation failed");
      setLoading(false);
    }
  };
  const LoadingPopup = () => {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "18px", marginBottom: "10px" }}>
            Processing...
          </span>
          <LoadingScreen /> {/* Your existing loading component */}
        </div>
      </div>
    );
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src={logo} width={100} height={100} alt="Logo" />
        <CustomizedSwitches />
      </div>
      <h1 className="title1">Join DocLink</h1>
      <h1 className="title2">and Stay Connected to Your Health.</h1>

      <div
        className="decider"
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div className="decider1" style={{ backgroundColor: "" }}>
          <Button
            className="button btn "
            id="lr-button"
            variant="contained"
            disabled
          >
            Register
          </Button>
        </div>
        {"|"}
        <div className="decider2" style={{ backgroundColor: "" }}>
          <Button
            className="button btn "
            id="lr-button"
            variant="outlined"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>
      {loading && <LoadingPopup />}
      <div style={{ justifyItems: "center", marginTop: "50px" }}>
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <form
            onSubmit={
              formData.role === "doctor"
                ? handleSubmitDoctor
                : handleSubmitPatient
            }
            action={
              formData.role === "doctor" ? "/registerdoctor" : "/register"
            }
            method="POST"
            encType="multipart/form-data"
          >
            <TextField
              fullWidth
              style={{ backgroundColor: "white", borderRadius: "8px" }}
              label="First Name"
              id="fullWidth"
              name="firstName"
              onChange={handleChange}
            />
            {errors.firstName && (
              <p style={{ color: "red" }}>{errors.firstName}</p>
            )}
            <TextField
              fullWidth
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                marginTop: "20px",
              }}
              label="Last Name"
              id="fullWidth"
              name="lastName"
              onChange={handleChange}
            />
            {errors.lastName && (
              <p style={{ color: "red" }}>{errors.lastName}</p>
            )}
            <TextField
              fullWidth
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                marginTop: "20px",
              }}
              label="Email Address"
              id="fullWidth"
              name="email"
              onChange={handleChange}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            <TextField
              fullWidth
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                marginTop: "20px",
              }}
              label="Phone Number"
              id="fullWidth"
              name="phone"
              onChange={handleChange}
              type="number"
            />
            {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
            <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
              <InputLabel id="demo-simple-select-helper-label">
                Gender{" "}
              </InputLabel>
              <Select
                style={{ backgroundColor: "white", borderRadius: "8px" }}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={formData.gender}
                label="Gender"
                name="gender"
                onChange={handleChange}
              >
                <MenuItem value="" disabled>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>
            {errors.gender && <p style={{ color: "red" }}>{errors.gender}</p>}

            <TextField
              fullWidth
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                marginTop: "20px",
              }}
              label="Age"
              id="fullWidth"
              name="age"
              onChange={handleChange}
              type="number"
            />
            {errors.age && <p style={{ color: "red" }}>{errors.age}</p>}
            <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
              <InputLabel id="demo-simple-select-helper-label">
                State{" "}
              </InputLabel>
              <Select
                style={{ backgroundColor: "white", borderRadius: "8px" }}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={formData.state}
                label="State"
                name="state"
                onChange={handleChange}
              >
                <MenuItem value="" disabled>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"andhra-pradesh"}>Andhra Pradesh</MenuItem>
                <MenuItem value={"arunachal-pradesh"}>
                  Arunachal Pradesh
                </MenuItem>
                <MenuItem value={"assam"}>Assam</MenuItem>
                <MenuItem value={"bihar"}>Bihar</MenuItem>
                <MenuItem value={"chhattisgarh"}>Chhattisgarh</MenuItem>
                <MenuItem value={"goa"}>Goa</MenuItem>
                <MenuItem value={"gujarat"}>Gujarat</MenuItem>
                <MenuItem value={"haryana"}>Haryana</MenuItem>
                <MenuItem value={"himachal-pradesh"}>Himachal Pradesh</MenuItem>
                <MenuItem value={"jharkhand"}>Jharkhand</MenuItem>
                <MenuItem value={"karnataka"}>Karnataka</MenuItem>
                <MenuItem value={"kerala"}>Kerala</MenuItem>
                <MenuItem value={"madhya-pradesh"}>Madhya Pradesh</MenuItem>
                <MenuItem value={"maharashtra"}>Maharashtra</MenuItem>
                <MenuItem value={"manipur"}>Manipur</MenuItem>
                <MenuItem value={"meghalaya"}>Meghalaya</MenuItem>
                <MenuItem value={"mizoram"}>Mizoram</MenuItem>
                <MenuItem value={"nagaland"}>Nagaland</MenuItem>
                <MenuItem value={"odisha"}>Odisha</MenuItem>
                <MenuItem value={"punjab"}>Punjab</MenuItem>
                <MenuItem value={"rajasthan"}>Rajasthan</MenuItem>
                <MenuItem value={"sikkim"}>Sikkim</MenuItem>
                <MenuItem value={"tamil-nadu"}>Tamil Nadu</MenuItem>
                <MenuItem value={"telangana"}>Telangana</MenuItem>
                <MenuItem value={"tripura"}>Tripura</MenuItem>
                <MenuItem value={"uttar-pradesh"}>Uttar Pradesh</MenuItem>
                <MenuItem value={"uttarakhand"}>Uttarakhand</MenuItem>
                <MenuItem value={"west-bengal"}>West Bengal</MenuItem>
              </Select>
            </FormControl>
            {formData.state === "andhra-pradesh" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"anantapur"}>Anantapur</MenuItem>
                    <MenuItem value={"chittoor"}>Chittoor</MenuItem>
                    <MenuItem value={"east-godavari"}>East Godavari</MenuItem>
                    <MenuItem value={"guntur"}>Guntur</MenuItem>
                    <MenuItem value={"krishna"}>Krishna</MenuItem>
                    <MenuItem value={"kurnool"}>Kurnool</MenuItem>
                    <MenuItem value={"nellore"}>Nellore</MenuItem>
                    <MenuItem value={"prakasam"}>Prakasam</MenuItem>
                    <MenuItem value={"sri-potti-sriramulu-nellore"}>
                      Sri Potti Sriramulu Nellore
                    </MenuItem>
                    <MenuItem value={"visakhapatnam"}>Visakhapatnam</MenuItem>
                    <MenuItem value={"vizianagaram"}>Vizianagaram</MenuItem>
                    <MenuItem value={"west-godavari"}>West Godavari</MenuItem>
                    <MenuItem value={"ysr-kadapa"}>YSR Kadapa</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "arunachal-pradesh" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"anjaw"}>Anjaw</MenuItem>
                    <MenuItem value={"changlang"}>Changlang</MenuItem>
                    <MenuItem value={"dibang-valley"}>Dibang Valley</MenuItem>
                    <MenuItem value={"east-kameng"}>East Kameng</MenuItem>
                    <MenuItem value={"east-siang"}>East Siang</MenuItem>
                    <MenuItem value={"kamle"}>Kamle</MenuItem>
                    <MenuItem value={"kra-daadi"}>Kra Daadi</MenuItem>
                    <MenuItem value={"kurung-kumey"}>Kurung Kumey</MenuItem>
                    <MenuItem value={"lepa-rada"}>Lepa Rada</MenuItem>
                    <MenuItem value={"lohit"}>Lohit</MenuItem>
                    <MenuItem value={"longding"}>Longding</MenuItem>
                    <MenuItem value={"lower-dibang-valley"}>
                      Lower Dibang Valley
                    </MenuItem>
                    <MenuItem value={"lower-siang"}>Lower Siang</MenuItem>
                    <MenuItem value={"lower-subansiri"}>
                      Lower Subansiri
                    </MenuItem>
                    <MenuItem value={"namsai"}>Namsai</MenuItem>
                    <MenuItem value={"pakke-kessang"}>Pakke Kessang</MenuItem>
                    <MenuItem value={"papum-pare"}>Papum Pare</MenuItem>
                    <MenuItem value={"shi-yomi"}>Shi Yomi</MenuItem>
                    <MenuItem value={"siang"}>Siang</MenuItem>
                    <MenuItem value={"tawang"}>Tawang</MenuItem>
                    <MenuItem value={"tirap"}>Tirap</MenuItem>
                    <MenuItem value={"upper-siang"}>Upper Siang</MenuItem>
                    <MenuItem value={"upper-subansiri"}>
                      Upper Subansiri
                    </MenuItem>
                    <MenuItem value={"west-kameng"}>West Kameng</MenuItem>
                    <MenuItem value={"west-siang"}>West Siang</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "assam" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"baksa"}>Baksa</MenuItem>
                    <MenuItem value={"barpeta"}>Barpeta</MenuItem>
                    <MenuItem value={"biswanath"}>Biswanath</MenuItem>
                    <MenuItem value={"bongaigaon"}>Bongaigaon</MenuItem>
                    <MenuItem value={"cachar"}>Cachar</MenuItem>
                    <MenuItem value={"charaideo"}>Charaideo</MenuItem>
                    <MenuItem value={"chirang"}>Chirang</MenuItem>
                    <MenuItem value={"darrang"}>Darrang</MenuItem>
                    <MenuItem value={"dhemaji"}>Dhemaji</MenuItem>
                    <MenuItem value={"dhubri"}>Dhubri</MenuItem>
                    <MenuItem value={"dibrugarh"}>Dibrugarh</MenuItem>
                    <MenuItem value={"goalpara"}>Goalpara</MenuItem>
                    <MenuItem value={"golaghat"}>Golaghat</MenuItem>
                    <MenuItem value={"hailakandi"}>Hailakandi</MenuItem>
                    <MenuItem value={"hojai"}>Hojai</MenuItem>
                    <MenuItem value={"jorhat"}>Jorhat</MenuItem>
                    <MenuItem value={"kamrup"}>Kamrup</MenuItem>
                    <MenuItem value={"kamrup-metropolitan"}>
                      Kamrup Metropolitan
                    </MenuItem>
                    <MenuItem value={"karbi-anglong"}>Karbi Anglong</MenuItem>
                    <MenuItem value={"karimganj"}>Karimganj</MenuItem>
                    <MenuItem value={"kokrajhar"}>Kokrajhar</MenuItem>
                    <MenuItem value={"lakhimpur"}>Lakhimpur</MenuItem>
                    <MenuItem value={"majuli"}>Majuli</MenuItem>
                    <MenuItem value={"morigaon"}>Morigaon</MenuItem>
                    <MenuItem value={"nagaon"}>Nagaon</MenuItem>
                    <MenuItem value={"nalbari"}>Nalbari</MenuItem>
                    <MenuItem value={"sivasagar"}>Sivasagar</MenuItem>
                    <MenuItem value={"sonitpur"}>Sonitpur</MenuItem>
                    <MenuItem value={"south-salmara-mankachar"}>
                      South Salmara Mankachar
                    </MenuItem>
                    <MenuItem value={"tinsukia"}>Tinsukia</MenuItem>
                    <MenuItem value={"udalguri"}>Udalguri</MenuItem>
                    <MenuItem value={"west-karbi-anglong"}>
                      West Karbi Anglong
                    </MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "bihar" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"araria"}>Araria</MenuItem>
                    <MenuItem value={"arwal"}>Arwal</MenuItem>
                    <MenuItem value={"aurangabad"}>Aurangabad</MenuItem>
                    <MenuItem value={"banka"}>Banka</MenuItem>
                    <MenuItem value={"begusarai"}>Begusarai</MenuItem>
                    <MenuItem value={"bhagalpur"}>Bhagalpur</MenuItem>
                    <MenuItem value={"bhojpur"}>Bhojpur</MenuItem>
                    <MenuItem value={"buxar"}>Buxar</MenuItem>
                    <MenuItem value={"darbhanga"}>Darbhanga</MenuItem>
                    <MenuItem value={"east-champaran"}>East Champaran</MenuItem>
                    <MenuItem value={"gaya"}>Gaya</MenuItem>
                    <MenuItem value={"gopalganj"}>Gopalganj</MenuItem>
                    <MenuItem value={"jamui"}>Jamui</MenuItem>
                    <MenuItem value={"jehanabad"}>Jehanabad</MenuItem>
                    <MenuItem value={"kaimur"}>Kaimur</MenuItem>
                    <MenuItem value={"katihar"}>Katihar</MenuItem>
                    <MenuItem value={"khagaria"}>Khagaria</MenuItem>
                    <MenuItem value={"kishanganj"}>Kishanganj</MenuItem>
                    <MenuItem value={"lakhisarai"}>Lakhisarai</MenuItem>
                    <MenuItem value={"madhepura"}>Madhepura</MenuItem>
                    <MenuItem value={"madhubani"}>Madhubani</MenuItem>
                    <MenuItem value={"munger"}>Munger</MenuItem>
                    <MenuItem value={"muzaffarpur"}>Muzaffarpur</MenuItem>
                    <MenuItem value={"nalanda"}>Nalanda</MenuItem>
                    <MenuItem value={"nawada"}>Nawada</MenuItem>
                    <MenuItem value={"patna"}>Patna</MenuItem>
                    <MenuItem value={"purnia"}>Purnia</MenuItem>
                    <MenuItem value={"rohtas"}>Rohtas</MenuItem>
                    <MenuItem value={"saharsa"}>Saharsa</MenuItem>
                    <MenuItem value={"samastipur"}>Samastipur</MenuItem>
                    <MenuItem value={"saran"}>Saran</MenuItem>
                    <MenuItem value={"sheikhpura"}>Sheikhpura</MenuItem>
                    <MenuItem value={"sheohar"}>Sheohar</MenuItem>
                    <MenuItem value={"sitamarhi"}>Sitamarhi</MenuItem>
                    <MenuItem value={"siwan"}>Siwan</MenuItem>
                    <MenuItem value={"supaul"}>Supaul</MenuItem>
                    <MenuItem value={"vaishali"}>Vaishali</MenuItem>
                    <MenuItem value={"west-champaran"}>West Champaran</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "chhattisgarh" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"balod"}>Balod</MenuItem>
                    <MenuItem value={"baloda-bazar"}>Baloda Bazar</MenuItem>
                    <MenuItem value={"balrampur"}>Balrampur</MenuItem>
                    <MenuItem value={"bastar"}>Bastar</MenuItem>
                    <MenuItem value={"bemetara"}>Bemetara</MenuItem>
                    <MenuItem value={"bijapur"}>Bijapur</MenuItem>
                    <MenuItem value={"bilaspur"}>Bilaspur</MenuItem>
                    <MenuItem value={"dantewada"}>Dantewada</MenuItem>
                    <MenuItem value={"dhamtari"}>Dhamtari</MenuItem>
                    <MenuItem value={"durg"}>Durg</MenuItem>
                    <MenuItem value={"gariaband"}>Gariaband</MenuItem>
                    <MenuItem value={"gaurela-pendra-marwahi"}>
                      Gaurela-Pendra-Marwahi
                    </MenuItem>
                    <MenuItem value={"janjgir-champa"}>Janjgir-Champa</MenuItem>
                    <MenuItem value={"jashpur"}>Jashpur</MenuItem>
                    <MenuItem value={"kabirdham"}>Kabirdham</MenuItem>
                    <MenuItem value={"kanker"}>Kanker</MenuItem>
                    <MenuItem value={"kondagaon"}>Kondagaon</MenuItem>
                    <MenuItem value={"korba"}>Korba</MenuItem>
                    <MenuItem value={"koriya"}>Koriya</MenuItem>
                    <MenuItem value={"mahasamund"}>Mahasamund</MenuItem>
                    <MenuItem value={"mungeli"}>Mungeli</MenuItem>
                    <MenuItem value={"narayanpur"}>Narayanpur</MenuItem>
                    <MenuItem value={"raigarh"}>Raigarh</MenuItem>
                    <MenuItem value={"raipur"}>Raipur</MenuItem>
                    <MenuItem value={"rajnandgaon"}>Rajnandgaon</MenuItem>
                    <MenuItem value={"sukma"}>Sukma</MenuItem>
                    <MenuItem value={"surajpur"}>Surajpur</MenuItem>
                    <MenuItem value={"surguja"}>Surguja</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "goa" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"north-goa"}>North Goa</MenuItem>
                    <MenuItem value={"south-goa"}>South Goa</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "gujarat" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"ahmedabad"}>Ahmedabad</MenuItem>
                    <MenuItem value={"amreli"}>Amreli</MenuItem>
                    <MenuItem value={"anand"}>Anand</MenuItem>
                    <MenuItem value={"aravalli"}>Aravalli</MenuItem>
                    <MenuItem value={"banaskantha"}>Banaskantha</MenuItem>
                    <MenuItem value={"bharuch"}>Bharuch</MenuItem>
                    <MenuItem value={"bhavnagar"}>Bhavnagar</MenuItem>
                    <MenuItem value={"botad"}>Botad</MenuItem>
                    <MenuItem value={"chhota-udaipur"}>Chhota Udaipur</MenuItem>
                    <MenuItem value={"dahod"}>Dahod</MenuItem>
                    <MenuItem value={"dang"}>Dang</MenuItem>
                    <MenuItem value={"devbhoomi-dwarka"}>
                      Devbhoomi Dwarka
                    </MenuItem>
                    <MenuItem value={"gandhinagar"}>Gandhinagar</MenuItem>
                    <MenuItem value={"gir-somnath"}>Gir Somnath</MenuItem>
                    <MenuItem value={"jamnagar"}>Jamnagar</MenuItem>
                    <MenuItem value={"junagadh"}>Junagadh</MenuItem>
                    <MenuItem value={"kachchh"}>Kachchh</MenuItem>
                    <MenuItem value={"kheda"}>Kheda</MenuItem>
                    <MenuItem value={"mahisagar"}>Mahisagar</MenuItem>
                    <MenuItem value={"mehsana"}>Mehsana</MenuItem>
                    <MenuItem value={"morbi"}>Morbi</MenuItem>
                    <MenuItem value={"narmada"}>Narmada</MenuItem>
                    <MenuItem value={"navsari"}>Navsari</MenuItem>
                    <MenuItem value={"panchmahal"}>Panchmahal</MenuItem>
                    <MenuItem value={"patan"}>Patan</MenuItem>
                    <MenuItem value={"porbandar"}>Porbandar</MenuItem>
                    <MenuItem value={"rajkot"}>Rajkot</MenuItem>
                    <MenuItem value={"sabarkantha"}>Sabarkantha</MenuItem>
                    <MenuItem value={"surat"}>Surat</MenuItem>
                    <MenuItem value={"surendranagar"}>Surendranagar</MenuItem>
                    <MenuItem value={"tapi"}>Tapi</MenuItem>
                    <MenuItem value={"vadodara"}>Vadodara</MenuItem>
                    <MenuItem value={"valsad"}>Valsad</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "haryana" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"ambala"}>Ambala</MenuItem>
                    <MenuItem value={"bhiwani"}>Bhiwani</MenuItem>
                    <MenuItem value={"charkhi-dadri"}>Charkhi Dadri</MenuItem>
                    <MenuItem value={"faridabad"}>Faridabad</MenuItem>
                    <MenuItem value={"fatehabad"}>Fatehabad</MenuItem>
                    <MenuItem value={"gurugram"}>Gurugram</MenuItem>
                    <MenuItem value={"hisar"}>Hisar</MenuItem>
                    <MenuItem value={"jhajjar"}>Jhajjar</MenuItem>
                    <MenuItem value={"jind"}>Jind</MenuItem>
                    <MenuItem value={"kaithal"}>Kaithal</MenuItem>
                    <MenuItem value={"karnal"}>Karnal</MenuItem>
                    <MenuItem value={"kurukshetra"}>Kurukshetra</MenuItem>
                    <MenuItem value={"mahendragarh"}>Mahendragarh</MenuItem>
                    <MenuItem value={"nuh"}>Nuh</MenuItem>
                    <MenuItem value={"palwal"}>Palwal</MenuItem>
                    <MenuItem value={"panchkula"}>Panchkula</MenuItem>
                    <MenuItem value={"panipat"}>Panipat</MenuItem>
                    <MenuItem value={"rewari"}>Rewari</MenuItem>
                    <MenuItem value={"rohtak"}>Rohtak</MenuItem>
                    <MenuItem value={"sirsa"}>Sirsa</MenuItem>
                    <MenuItem value={"sonipat"}>Sonipat</MenuItem>
                    <MenuItem value={"yamunanagar"}>Yamunanagar</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "himachal-pradesh" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"bilaspur"}>Bilaspur</MenuItem>
                    <MenuItem value={"chamba"}>Chamba</MenuItem>
                    <MenuItem value={"hamirpur"}>Hamirpur</MenuItem>
                    <MenuItem value={"kangra"}>Kangra</MenuItem>
                    <MenuItem value={"kinnaur"}>Kinnaur</MenuItem>
                    <MenuItem value={"kullu"}>Kullu</MenuItem>
                    <MenuItem value={"lahaul-and-spiti"}>
                      Lahaul and Spiti
                    </MenuItem>
                    <MenuItem value={"mandi"}>Mandi</MenuItem>
                    <MenuItem value={"shimla"}>Shimla</MenuItem>
                    <MenuItem value={"sirmaur"}>Sirmaur</MenuItem>
                    <MenuItem value={"solan"}>Solan</MenuItem>
                    <MenuItem value={"una"}>Una</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {formData.state === "jharkhand" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"bokaro"}>Bokaro</MenuItem>
                    <MenuItem value={"chatra"}>Chatra</MenuItem>
                    <MenuItem value={"deoghar"}>Deoghar</MenuItem>
                    <MenuItem value={"dhanbad"}>Dhanbad</MenuItem>
                    <MenuItem value={"dumka"}>Dumka</MenuItem>
                    <MenuItem value={"east-singhbhum"}>East Singhbhum</MenuItem>
                    <MenuItem value={"garhwa"}>Garhwa</MenuItem>
                    <MenuItem value={"giridih"}>Giridih</MenuItem>
                    <MenuItem value={"godda"}>Godda</MenuItem>
                    <MenuItem value={"gumla"}>Gumla</MenuItem>
                    <MenuItem value={"hazaribagh"}>Hazaribagh</MenuItem>
                    <MenuItem value={"jamtara"}>Jamtara</MenuItem>
                    <MenuItem value={"khunti"}>Khunti</MenuItem>
                    <MenuItem value={"koderma"}>Koderma</MenuItem>
                    <MenuItem value={"latehar"}>Latehar</MenuItem>
                    <MenuItem value={"lohardaga"}>Lohardaga</MenuItem>
                    <MenuItem value={"pakur"}>Pakur</MenuItem>
                    <MenuItem value={"palamu"}>Palamu</MenuItem>
                    <MenuItem value={"ramgarh"}>Ramgarh</MenuItem>
                    <MenuItem value={"ranchi"}>Ranchi</MenuItem>
                    <MenuItem value={"sahibganj"}>Sahibganj</MenuItem>
                    <MenuItem value={"seraikela-kharsawan"}>
                      Seraikela Kharsawan
                    </MenuItem>
                    <MenuItem value={"simdega"}>Simdega</MenuItem>
                    <MenuItem value={"west-singhbhum"}>West Singhbhum</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {formData.state === "karnataka" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"bagalkot"}>Bagalkot</MenuItem>
                    <MenuItem value={"ballari"}>Ballari</MenuItem>
                    <MenuItem value={"belagavi"}>Belagavi</MenuItem>
                    <MenuItem value={"bengaluru-rural"}>
                      Bengaluru Rural
                    </MenuItem>
                    <MenuItem value={"bengaluru-urban"}>
                      Bengaluru Urban
                    </MenuItem>
                    <MenuItem value={"bidar"}>Bidar</MenuItem>
                    <MenuItem value={"chamarajanagara"}>
                      Chamarajanagara
                    </MenuItem>
                    <MenuItem value={"chikkaballapur"}>Chikkaballapur</MenuItem>
                    <MenuItem value={"chikkamagaluru"}>Chikkamagaluru</MenuItem>
                    <MenuItem value={"chitradurga"}>Chitradurga</MenuItem>
                    <MenuItem value={"dakshina-kannada"}>
                      Dakshina Kannada
                    </MenuItem>
                    <MenuItem value={"davanagere"}>Davanagere</MenuItem>
                    <MenuItem value={"dharwad"}>Dharwad</MenuItem>
                    <MenuItem value={"gadag"}>Gadag</MenuItem>
                    <MenuItem value={"hassan"}>Hassan</MenuItem>
                    <MenuItem value={"haveri"}>Haveri</MenuItem>
                    <MenuItem value={"kalaburagi"}>Kalaburagi</MenuItem>
                    <MenuItem value={"kodagu"}>Kodagu</MenuItem>
                    <MenuItem value={"kolar"}>Kolar</MenuItem>
                    <MenuItem value={"koppal"}>Koppal</MenuItem>
                    <MenuItem value={"mandya"}>Mandya</MenuItem>
                    <MenuItem value={"mysuru"}>Mysuru</MenuItem>
                    <MenuItem value={"raichur"}>Raichur</MenuItem>
                    <MenuItem value={"ramanagara"}>Ramanagara</MenuItem>
                    <MenuItem value={"shivamogga"}>Shivamogga</MenuItem>
                    <MenuItem value={"tumakuru"}>Tumakuru</MenuItem>
                    <MenuItem value={"udupi"}>Udupi</MenuItem>
                    <MenuItem value={"uttara-kannada"}>Uttara Kannada</MenuItem>
                    <MenuItem value={"vijayapura"}>Vijayapura</MenuItem>
                    <MenuItem value={"yadgir"}>Yadgir</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "madhya-pradesh" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"anuppur"}>Anuppur</MenuItem>
                    <MenuItem value={"ashoknagar"}>Ashoknagar</MenuItem>
                    <MenuItem value={"balaghat"}>Balaghat</MenuItem>
                    <MenuItem value={"barwani"}>Barwani</MenuItem>
                    <MenuItem value={"betul"}>Betul</MenuItem>
                    <MenuItem value={"bhind"}>Bhind</MenuItem>
                    <MenuItem value={"bhopal"}>Bhopal</MenuItem>
                    <MenuItem value={"burhanpur"}>Burhanpur</MenuItem>
                    <MenuItem value={"chhatarpur"}>Chhatarpur</MenuItem>
                    <MenuItem value={"chhindwara"}>Chhindwara</MenuItem>
                    <MenuItem value={"damoh"}>Damoh</MenuItem>
                    <MenuItem value={"datia"}>Datia</MenuItem>
                    <MenuItem value={"dewas"}>Dewas</MenuItem>
                    <MenuItem value={"dhar"}>Dhar</MenuItem>
                    <MenuItem value={"dindori"}>Dindori</MenuItem>
                    <MenuItem value={"guna"}>Guna</MenuItem>
                    <MenuItem value={"gwalior"}>Gwalior</MenuItem>
                    <MenuItem value={"harda"}>Harda</MenuItem>
                    <MenuItem value={"hoshangabad"}>Hoshangabad</MenuItem>
                    <MenuItem value={"indore"}>Indore</MenuItem>
                    <MenuItem value={"jabalpur"}>Jabalpur</MenuItem>
                    <MenuItem value={"jhabua"}>Jhabua</MenuItem>
                    <MenuItem value={"katni"}>Katni</MenuItem>
                    <MenuItem value={"khandwa"}>Khandwa</MenuItem>
                    <MenuItem value={"khargone"}>Khargone</MenuItem>
                    <MenuItem value={"mandla"}>Mandla</MenuItem>
                    <MenuItem value={"mandsaur"}>Mandsaur</MenuItem>
                    <MenuItem value={"morena"}>Morena</MenuItem>
                    <MenuItem value={"narsinghpur"}>Narsinghpur</MenuItem>
                    <MenuItem value={"neemuch"}>Neemuch</MenuItem>
                    <MenuItem value={"panna"}>Panna</MenuItem>
                    <MenuItem value={"raisen"}>Raisen</MenuItem>
                    <MenuItem value={"rajgarh"}>Rajgarh</MenuItem>
                    <MenuItem value={"ratlam"}>Ratlam</MenuItem>
                    <MenuItem value={"rewa"}>Rewa</MenuItem>
                    <MenuItem value={"sagar"}>Sagar</MenuItem>
                    <MenuItem value={"satna"}>Satna</MenuItem>
                    <MenuItem value={"sehore"}>Sehore</MenuItem>
                    <MenuItem value={"seoni"}>Seoni</MenuItem>
                    <MenuItem value={"shahdol"}>Shahdol</MenuItem>
                    <MenuItem value={"shajapur"}>Shajapur</MenuItem>
                    <MenuItem value={"sheopur"}>Sheopur</MenuItem>
                    <MenuItem value={"shivpuri"}>Shivpuri</MenuItem>
                    <MenuItem value={"sidhi"}>Sidhi</MenuItem>
                    <MenuItem value={"singrauli"}>Singrauli</MenuItem>
                    <MenuItem value={"tikamgarh"}>Tikamgarh</MenuItem>
                    <MenuItem value={"ujjain"}>Ujjain</MenuItem>
                    <MenuItem value={"umaria"}>Umaria</MenuItem>
                    <MenuItem value={"vidisha"}>Vidisha</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "maharashtra" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"ahmednagar"}>Ahmednagar</MenuItem>
                    <MenuItem value={"akola"}>Akola</MenuItem>
                    <MenuItem value={"amravati"}>Amravati</MenuItem>
                    <MenuItem value={"aurangabad"}>Aurangabad</MenuItem>
                    <MenuItem value={"beed"}>Beed</MenuItem>
                    <MenuItem value={"bhandara"}>Bhandara</MenuItem>
                    <MenuItem value={"buldhana"}>Buldhana</MenuItem>
                    <MenuItem value={"chandrapur"}>Chandrapur</MenuItem>
                    <MenuItem value={"dhule"}>Dhule</MenuItem>
                    <MenuItem value={"gadchiroli"}>Gadchiroli</MenuItem>
                    <MenuItem value={"gondia"}>Gondia</MenuItem>
                    <MenuItem value={"hingoli"}>Hingoli</MenuItem>
                    <MenuItem value={"jalgaon"}>Jalgaon</MenuItem>
                    <MenuItem value={"jalna"}>Jalna</MenuItem>
                    <MenuItem value={"kolhapur"}>Kolhapur</MenuItem>
                    <MenuItem value={"latur"}>Latur</MenuItem>
                    <MenuItem value={"mumbai-city"}>Mumbai City</MenuItem>
                    <MenuItem value={"mumbai-suburban"}>
                      Mumbai Suburban
                    </MenuItem>
                    <MenuItem value={"nagpur"}>Nagpur</MenuItem>
                    <MenuItem value={"nanded"}>Nanded</MenuItem>
                    <MenuItem value={"nandurbar"}>Nandurbar</MenuItem>
                    <MenuItem value={"nashik"}>Nashik</MenuItem>
                    <MenuItem value={"osmanabad"}>Osmanabad</MenuItem>
                    <MenuItem value={"palghar"}>Palghar</MenuItem>
                    <MenuItem value={"parbhani"}>Parbhani</MenuItem>
                    <MenuItem value={"pune"}>Pune</MenuItem>
                    <MenuItem value={"raigad"}>Raigad</MenuItem>
                    <MenuItem value={"ratnagiri"}>Ratnagiri</MenuItem>
                    <MenuItem value={"sangli"}>Sangli</MenuItem>
                    <MenuItem value={"satara"}>Satara</MenuItem>
                    <MenuItem value={"sindhudurg"}>Sindhudurg</MenuItem>
                    <MenuItem value={"solapur"}>Solapur</MenuItem>
                    <MenuItem value={"thane"}>Thane</MenuItem>
                    <MenuItem value={"wardha"}>Wardha</MenuItem>
                    <MenuItem value={"washim"}>Washim</MenuItem>
                    <MenuItem value={"yavatmal"}>Yavatmal</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "manipur" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"bishnupur"}>Bishnupur</MenuItem>
                    <MenuItem value={"chandel"}>Chandel</MenuItem>
                    <MenuItem value={"churachandpur"}>Churachandpur</MenuItem>
                    <MenuItem value={"imphal-east"}>Imphal East</MenuItem>
                    <MenuItem value={"imphal-west"}>Imphal West</MenuItem>
                    <MenuItem value={"jiribam"}>Jiribam</MenuItem>
                    <MenuItem value={"kakching"}>Kakching</MenuItem>
                    <MenuItem value={"kamjong"}>Kamjong</MenuItem>
                    <MenuItem value={"kangpokpi"}>Kangpokpi</MenuItem>
                    <MenuItem value={"noney"}>Noney</MenuItem>
                    <MenuItem value={"pherzawl"}>Pherzawl</MenuItem>
                    <MenuItem value={"senapati"}>Senapati</MenuItem>
                    <MenuItem value={"tamenglong"}>Tamenglong</MenuItem>
                    <MenuItem value={"tengnoupal"}>Tengnoupal</MenuItem>
                    <MenuItem value={"thoubal"}>Thoubal</MenuItem>
                    <MenuItem value={"ukhrul"}>Ukhrul</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "meghalaya" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"east-garo-hills"}>
                      East Garo Hills
                    </MenuItem>
                    <MenuItem value={"east-jaintia-hills"}>
                      East Jaintia Hills
                    </MenuItem>
                    <MenuItem value={"east-khasi-hills"}>
                      East Khasi Hills
                    </MenuItem>
                    <MenuItem value={"north-garo-hills"}>
                      North Garo Hills
                    </MenuItem>
                    <MenuItem value={"ri-bhoi"}>Ri Bhoi</MenuItem>
                    <MenuItem value={"south-garo-hills"}>
                      South Garo Hills
                    </MenuItem>
                    <MenuItem value={"south-west-garo-hills"}>
                      South West Garo Hills
                    </MenuItem>
                    <MenuItem value={"south-west-khasi-hills"}>
                      South West Khasi Hills
                    </MenuItem>
                    <MenuItem value={"west-garo-hills"}>
                      West Garo Hills
                    </MenuItem>
                    <MenuItem value={"west-jaintia-hills"}>
                      West Jaintia Hills
                    </MenuItem>
                    <MenuItem value={"west-khasi-hills"}>
                      West Khasi Hills
                    </MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "mizoram" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"aizawl"}>Aizawl</MenuItem>
                    <MenuItem value={"champhai"}>Champhai</MenuItem>
                    <MenuItem value={"hnahthial"}>Hnahthial</MenuItem>
                    <MenuItem value={"khawzawl"}>Khawzawl</MenuItem>
                    <MenuItem value={"kolasib"}>Kolasib</MenuItem>
                    <MenuItem value={"lawngtlai"}>Lawngtlai</MenuItem>
                    <MenuItem value={"lunglei"}>Lunglei</MenuItem>
                    <MenuItem value={"mamit"}>Mamit</MenuItem>
                    <MenuItem value={"saiha"}>Saiha</MenuItem>
                    <MenuItem value={"serchhip"}>Serchhip</MenuItem>
                    <MenuItem value={"saitual"}>Saitual</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "nagaland" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"dimapur"}>Dimapur</MenuItem>
                    <MenuItem value={"kiphire"}>Kiphire</MenuItem>
                    <MenuItem value={"kohima"}>Kohima</MenuItem>
                    <MenuItem value={"longleng"}>Longleng</MenuItem>
                    <MenuItem value={"mokokchung"}>Mokokchung</MenuItem>
                    <MenuItem value={"mon"}>Mon</MenuItem>
                    <MenuItem value={"peren"}>Peren</MenuItem>
                    <MenuItem value={"phek"}>Phek</MenuItem>
                    <MenuItem value={"tuensang"}>Tuensang</MenuItem>
                    <MenuItem value={"wokha"}>Wokha</MenuItem>
                    <MenuItem value={"zunheboto"}>Zunheboto</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "odisha" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"angul"}>Angul</MenuItem>
                    <MenuItem value={"balangir"}>Balangir</MenuItem>
                    <MenuItem value={"balasore"}>Balasore</MenuItem>
                    <MenuItem value={"bargarh"}>Bargarh</MenuItem>
                    <MenuItem value={"bhadrak"}>Bhadrak</MenuItem>
                    <MenuItem value={"boudh"}>Boudh</MenuItem>
                    <MenuItem value={"cuttack"}>Cuttack</MenuItem>
                    <MenuItem value={"deogarh"}>Deogarh</MenuItem>
                    <MenuItem value={"dhenkanal"}>Dhenkanal</MenuItem>
                    <MenuItem value={"gajapati"}>Gajapati</MenuItem>
                    <MenuItem value={"ganjam"}>Ganjam</MenuItem>
                    <MenuItem value={"jagatsinghpur"}>Jagatsinghpur</MenuItem>
                    <MenuItem value={"jajpur"}>Jajpur</MenuItem>
                    <MenuItem value={"jharsuguda"}>Jharsuguda</MenuItem>
                    <MenuItem value={"kalahandi"}>Kalahandi</MenuItem>
                    <MenuItem value={"kandhamal"}>Kandhamal</MenuItem>
                    <MenuItem value={"kendrapara"}>Kendrapara</MenuItem>
                    <MenuItem value={"kendujhar"}>Kendujhar</MenuItem>
                    <MenuItem value={"khordha"}>Khordha</MenuItem>
                    <MenuItem value={"koraput"}>Koraput</MenuItem>
                    <MenuItem value={"malkangiri"}>Malkangiri</MenuItem>
                    <MenuItem value={"mayurbhanj"}>Mayurbhanj</MenuItem>
                    <MenuItem value={"nabarangpur"}>Nabarangpur</MenuItem>
                    <MenuItem value={"nayagarh"}>Nayagarh</MenuItem>
                    <MenuItem value={"nuapada"}>Nuapada</MenuItem>
                    <MenuItem value={"puri"}>Puri</MenuItem>
                    <MenuItem value={"rayagada"}>Rayagada</MenuItem>
                    <MenuItem value={"sambalpur"}>Sambalpur</MenuItem>
                    <MenuItem value={"subarnapur"}>Subarnapur</MenuItem>
                    <MenuItem value={"sundargarh"}>Sundargarh</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "punjab" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"amritsar"}>Amritsar</MenuItem>
                    <MenuItem value={"barnala"}>Barnala</MenuItem>
                    <MenuItem value={"bathinda"}>Bathinda</MenuItem>
                    <MenuItem value={"faridkot"}>Faridkot</MenuItem>
                    <MenuItem value={"fatehgarh-sahib"}>
                      Fatehgarh Sahib
                    </MenuItem>
                    <MenuItem value={"fazilka"}>Fazilka</MenuItem>
                    <MenuItem value={"ferozepur"}>Ferozepur</MenuItem>
                    <MenuItem value={"gurdaspur"}>Gurdaspur</MenuItem>
                    <MenuItem value={"hoshiarpur"}>Hoshiarpur</MenuItem>
                    <MenuItem value={"jalandhar"}>Jalandhar</MenuItem>
                    <MenuItem value={"kapurthala"}>Kapurthala</MenuItem>
                    <MenuItem value={"ludhiana"}>Ludhiana</MenuItem>
                    <MenuItem value={"mansa"}>Mansa</MenuItem>
                    <MenuItem value={"moga"}>Moga</MenuItem>
                    <MenuItem value={"muktsar"}>Muktsar</MenuItem>
                    <MenuItem value={"nawanshahr"}>Nawanshahr</MenuItem>
                    <MenuItem value={"pathankot"}>Pathankot</MenuItem>
                    <MenuItem value={"patiala"}>Patiala</MenuItem>
                    <MenuItem value={"rupnagar"}>Rupnagar</MenuItem>
                    <MenuItem value={"sangrur"}>Sangrur</MenuItem>
                    <MenuItem value={"s.a.s-nagar"}>S.A.S Nagar</MenuItem>
                    <MenuItem value={"tarn-taran"}>Tarn Taran</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {formData.state === "rajasthan" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"ajmer"}>Ajmer</MenuItem>
                    <MenuItem value={"alwar"}>Alwar</MenuItem>
                    <MenuItem value={"banswara"}>Banswara</MenuItem>
                    <MenuItem value={"baran"}>Baran</MenuItem>
                    <MenuItem value={"barmer"}>Barmer</MenuItem>
                    <MenuItem value={"bharatpur"}>Bharatpur</MenuItem>
                    <MenuItem value={"bhilwara"}>Bhilwara</MenuItem>
                    <MenuItem value={"bikaner"}>Bikaner</MenuItem>
                    <MenuItem value={"bundi"}>Bundi</MenuItem>
                    <MenuItem value={"chittorgarh"}>Chittorgarh</MenuItem>
                    <MenuItem value={"churu"}>Churu</MenuItem>
                    <MenuItem value={"dausa"}>Dausa</MenuItem>
                    <MenuItem value={"dholpur"}>Dholpur</MenuItem>
                    <MenuItem value={"dungarpur"}>Dungarpur</MenuItem>
                    <MenuItem value={"hanumangarh"}>Hanumangarh</MenuItem>
                    <MenuItem value={"jaipur"}>Jaipur</MenuItem>
                    <MenuItem value={"jaisalmer"}>Jaisalmer</MenuItem>
                    <MenuItem value={"jalor"}>Jalore</MenuItem>
                    <MenuItem value={"jhalawar"}>Jhalawar</MenuItem>
                    <MenuItem value={"jhunjhunu"}>Jhunjhunu</MenuItem>
                    <MenuItem value={"jodhpur"}>Jodhpur</MenuItem>
                    <MenuItem value={"karauli"}>Karauli</MenuItem>
                    <MenuItem value={"kota"}>Kota</MenuItem>
                    <MenuItem value={"nagaur"}>Nagaur</MenuItem>
                    <MenuItem value={"pali"}>Pali</MenuItem>
                    <MenuItem value={"pratapgarh"}>Pratapgarh</MenuItem>
                    <MenuItem value={"rajsamand"}>Rajsamand</MenuItem>
                    <MenuItem value={"sawai-madhopur"}>Sawai Madhopur</MenuItem>
                    <MenuItem value={"sikar"}>Sikar</MenuItem>
                    <MenuItem value={"sirohi"}>Sirohi</MenuItem>
                    <MenuItem value={"tonk"}>Tonk</MenuItem>
                    <MenuItem value={"udaipur"}>Udaipur</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "sikkim" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"east-sikkim"}>East Sikkim</MenuItem>
                    <MenuItem value={"north-sikkim"}>North Sikkim</MenuItem>
                    <MenuItem value={"south-sikkim"}>South Sikkim</MenuItem>
                    <MenuItem value={"west-sikkim"}>West Sikkim</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "telangana" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"adilabad"}>Adilabad</MenuItem>
                    <MenuItem value={"bhadradri-kothagudem"}>
                      Bhadradri Kothagudem
                    </MenuItem>
                    <MenuItem value={"hyderabad"}>Hyderabad</MenuItem>
                    <MenuItem value={"jagtial"}>Jagtial</MenuItem>
                    <MenuItem value={"jangaon"}>Jangaon</MenuItem>
                    <MenuItem value={"jayashankar-bhupalpally"}>
                      Jayashankar Bhupalpally
                    </MenuItem>
                    <MenuItem value={"jogulamba-gadwal"}>
                      Jogulamba Gadwal
                    </MenuItem>
                    <MenuItem value={"kamareddy"}>Kamareddy</MenuItem>
                    <MenuItem value={"karimnagar"}>Karimnagar</MenuItem>
                    <MenuItem value={"khammam"}>Khammam</MenuItem>
                    <MenuItem value={"komaram-bheem"}>Komaram Bheem</MenuItem>
                    <MenuItem value={"mahabubabad"}>Mahabubabad</MenuItem>
                    <MenuItem value={"mahabubnagar"}>Mahabubnagar</MenuItem>
                    <MenuItem value={"mancherial"}>Mancherial</MenuItem>
                    <MenuItem value={"medak"}>Medak</MenuItem>
                    <MenuItem value={"medchal-malkajgiri"}>
                      Medchal-Malkajgiri
                    </MenuItem>
                    <MenuItem value={"mulugu"}>Mulugu</MenuItem>
                    <MenuItem value={"nagarkurnool"}>Nagarkurnool</MenuItem>
                    <MenuItem value={"nalgonda"}>Nalgonda</MenuItem>
                    <MenuItem value={"narayanpet"}>Narayanpet</MenuItem>
                    <MenuItem value={"nirmal"}>Nirmal</MenuItem>
                    <MenuItem value={"nizamabad"}>Nizamabad</MenuItem>
                    <MenuItem value={"peddapalli"}>Peddapalli</MenuItem>
                    <MenuItem value={"rajanna-sircilla"}>
                      Rajanna Sircilla
                    </MenuItem>
                    <MenuItem value={"rangareddy"}>Rangareddy</MenuItem>
                    <MenuItem value={"sangareddy"}>Sangareddy</MenuItem>
                    <MenuItem value={"siddipet"}>Siddipet</MenuItem>
                    <MenuItem value={"suryapet"}>Suryapet</MenuItem>
                    <MenuItem value={"vikarabad"}>Vikarabad</MenuItem>
                    <MenuItem value={"wanaparthy"}>Wanaparthy</MenuItem>
                    <MenuItem value={"warangal-rural"}>Warangal Rural</MenuItem>
                    <MenuItem value={"warangal-urban"}>Warangal Urban</MenuItem>
                    <MenuItem value={"yadadri-bhuvanagiri"}>
                      Yadadri Bhuvanagiri
                    </MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "tripura" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"dhalai"}>Dhalai</MenuItem>
                    <MenuItem value={"gomati"}>Gomati</MenuItem>
                    <MenuItem value={"khowai"}>Khowai</MenuItem>
                    <MenuItem value={"north-tripura"}>North Tripura</MenuItem>
                    <MenuItem value={"sepahijala"}>Sepahijala</MenuItem>
                    <MenuItem value={"south-tripura"}>South Tripura</MenuItem>
                    <MenuItem value={"unakoti"}>Unakoti</MenuItem>
                    <MenuItem value={"west-tripura"}>West Tripura</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "uttar-pradesh" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"agra"}>Agra</MenuItem>
                    <MenuItem value={"aligarh"}>Aligarh</MenuItem>
                    <MenuItem value={"allahabad"}>Allahabad</MenuItem>
                    <MenuItem value={"ambedkar-nagar"}>Ambedkar Nagar</MenuItem>
                    <MenuItem value={"amethi"}>Amethi</MenuItem>
                    <MenuItem value={"amroha"}>Amroha</MenuItem>
                    <MenuItem value={"ayodhya"}>Ayodhya</MenuItem>
                    <MenuItem value={"azamgarh"}>Azamgarh</MenuItem>
                    <MenuItem value={"baghpat"}>Baghpat</MenuItem>
                    <MenuItem value={"bahraich"}>Bahraich</MenuItem>
                    <MenuItem value={"ballia"}>Ballia</MenuItem>
                    <MenuItem value={"balrampur"}>Balrampur</MenuItem>
                    <MenuItem value={"banda"}>Banda</MenuItem>
                    <MenuItem value={"bara-banki"}>Bara Banki</MenuItem>
                    <MenuItem value={"bareilly"}>Bareilly</MenuItem>
                    <MenuItem value={"basti"}>Basti</MenuItem>
                    <MenuItem value={"bhadohi"}>Bhadohi</MenuItem>
                    <MenuItem value={"bijnor"}>Bijnor</MenuItem>
                    <MenuItem value={"budaun"}>Budaun</MenuItem>
                    <MenuItem value={"bulandshahr"}>Bulandshahr</MenuItem>
                    <MenuItem value={"chandauli"}>Chandauli</MenuItem>
                    <MenuItem value={"chitrakoot"}>Chitrakoot</MenuItem>
                    <MenuItem value={"deoria"}>Deoria</MenuItem>
                    <MenuItem value={"etah"}>Etah</MenuItem>
                    <MenuItem value={"etawah"}>Etawah</MenuItem>
                    <MenuItem value={"faizabad"}>Faizabad</MenuItem>
                    <MenuItem value={"farrukhabad"}>Farrukhabad</MenuItem>
                    <MenuItem value={"fatehpur"}>Fatehpur</MenuItem>
                    <MenuItem value={"firozabad"}>Firozabad</MenuItem>
                    <MenuItem value={"gautam-buddha-nagar"}>
                      Gautam Buddha Nagar
                    </MenuItem>
                    <MenuItem value={"ghaziabad"}>Ghaziabad</MenuItem>
                    <MenuItem value={"ghazipur"}>Ghazipur</MenuItem>
                    <MenuItem value={"gonda"}>Gonda</MenuItem>
                    <MenuItem value={"gorakhpur"}>Gorakhpur</MenuItem>
                    <MenuItem value={"hamirpur"}>Hamirpur</MenuItem>
                    <MenuItem value={"hapur"}>Hapur</MenuItem>
                    <MenuItem value={"hardoi"}>Hardoi</MenuItem>
                    <MenuItem value={"hathras"}>Hathras</MenuItem>
                    <MenuItem value={"jalaun"}>Jalaun</MenuItem>
                    <MenuItem value={"jaunpur"}>Jaunpur</MenuItem>
                    <MenuItem value={"jhansi"}>Jhansi</MenuItem>
                    <MenuItem value={"kannauj"}>Kannauj</MenuItem>
                    <MenuItem value={"kanpur-dehat"}>Kanpur Dehat</MenuItem>
                    <MenuItem value={"kanpur-nagar"}>Kanpur Nagar</MenuItem>
                    <MenuItem value={"kasganj"}>Kasganj</MenuItem>
                    <MenuItem value={"kaushambi"}>Kaushambi</MenuItem>
                    <MenuItem value={"kheri"}>Kheri</MenuItem>
                    <MenuItem value={"kushinagar"}>Kushinagar</MenuItem>
                    <MenuItem value={"lalitpur"}>Lalitpur</MenuItem>
                    <MenuItem value={"lucknow"}>Lucknow</MenuItem>
                    <MenuItem value={"maharajganj"}>Maharajganj</MenuItem>
                    <MenuItem value={"mahoba"}>Mahoba</MenuItem>
                    <MenuItem value={"mainpuri"}>Mainpuri</MenuItem>
                    <MenuItem value={"mathura"}>Mathura</MenuItem>
                    <MenuItem value={"mau"}>Mau</MenuItem>
                    <MenuItem value={"meerut"}>Meerut</MenuItem>
                    <MenuItem value={"mirzapur"}>Mirzapur</MenuItem>
                    <MenuItem value={"moradabad"}>Moradabad</MenuItem>
                    <MenuItem value={"muzaffarnagar"}>Muzaffarnagar</MenuItem>
                    <MenuItem value={"pilibhit"}>Pilibhit</MenuItem>
                    <MenuItem value={"pratapgarh"}>Pratapgarh</MenuItem>
                    <MenuItem value={"prayagraj"}>Prayagraj</MenuItem>
                    <MenuItem value={"raebareli"}>Raebareli</MenuItem>
                    <MenuItem value={"rampur"}>Rampur</MenuItem>
                    <MenuItem value={"saharanpur"}>Saharanpur</MenuItem>
                    <MenuItem value={"sambhal"}>Sambhal</MenuItem>
                    <MenuItem value={"sant-kabir-nagar"}>
                      Sant Kabir Nagar
                    </MenuItem>
                    <MenuItem value={"sant-ravidas-nagar"}>
                      Sant Ravidas Nagar
                    </MenuItem>
                    <MenuItem value={"shahjahanpur"}>Shahjahanpur</MenuItem>
                    <MenuItem value={"shamli"}>Shamli</MenuItem>
                    <MenuItem value={"shravasti"}>Shravasti</MenuItem>
                    <MenuItem value={"siddharthnagar"}>Siddharthnagar</MenuItem>
                    <MenuItem value={"sitapur"}>Sitapur</MenuItem>
                    <MenuItem value={"sonbhadra"}>Sonbhadra</MenuItem>
                    <MenuItem value={"sultanpur"}>Sultanpur</MenuItem>
                    <MenuItem value={"unnao"}>Unnao</MenuItem>
                    <MenuItem value={"varanasi"}>Varanasi</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {formData.state === "uttarakhand" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"almora"}>Almora</MenuItem>
                    <MenuItem value={"bageshwar"}>Bageshwar</MenuItem>
                    <MenuItem value={"chamoli"}>Chamoli</MenuItem>
                    <MenuItem value={"champawat"}>Champawat</MenuItem>
                    <MenuItem value={"dehradun"}>Dehradun</MenuItem>
                    <MenuItem value={"haridwar"}>Haridwar</MenuItem>
                    <MenuItem value={"nainital"}>Nainital</MenuItem>
                    <MenuItem value={"pauri-garhwal"}>Pauri Garhwal</MenuItem>
                    <MenuItem value={"pithoragarh"}>Pithoragarh</MenuItem>
                    <MenuItem value={"rudraprayag"}>Rudraprayag</MenuItem>
                    <MenuItem value={"tehri-garhwal"}>Tehri Garhwal</MenuItem>
                    <MenuItem value={"udhamsingh-nagar"}>
                      Udham Singh Nagar
                    </MenuItem>
                    <MenuItem value={"uttarkashi"}>Uttarkashi</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "uttar-pradesh" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"agra"}>Agra</MenuItem>
                    <MenuItem value={"aligarh"}>Aligarh</MenuItem>
                    <MenuItem value={"allahabad"}>Allahabad</MenuItem>
                    <MenuItem value={"ambedkar-nagar"}>Ambedkar Nagar</MenuItem>
                    <MenuItem value={"amethi"}>Amethi</MenuItem>
                    <MenuItem value={"amroha"}>Amroha</MenuItem>
                    <MenuItem value={"ayodhya"}>Ayodhya</MenuItem>
                    <MenuItem value={"azamgarh"}>Azamgarh</MenuItem>
                    <MenuItem value={"baghpat"}>Baghpat</MenuItem>
                    <MenuItem value={"bahraich"}>Bahraich</MenuItem>
                    <MenuItem value={"ballia"}>Ballia</MenuItem>
                    <MenuItem value={"balrampur"}>Balrampur</MenuItem>
                    <MenuItem value={"banda"}>Banda</MenuItem>
                    <MenuItem value={"bara-banki"}>Bara Banki</MenuItem>
                    <MenuItem value={"bareilly"}>Bareilly</MenuItem>
                    <MenuItem value={"basti"}>Basti</MenuItem>
                    <MenuItem value={"bhadohi"}>Bhadohi</MenuItem>
                    <MenuItem value={"bijnor"}>Bijnor</MenuItem>
                    <MenuItem value={"budaun"}>Budaun</MenuItem>
                    <MenuItem value={"bulandshahr"}>Bulandshahr</MenuItem>
                    <MenuItem value={"chandauli"}>Chandauli</MenuItem>
                    <MenuItem value={"chitrakoot"}>Chitrakoot</MenuItem>
                    <MenuItem value={"deoria"}>Deoria</MenuItem>
                    <MenuItem value={"etah"}>Etah</MenuItem>
                    <MenuItem value={"etawah"}>Etawah</MenuItem>
                    <MenuItem value={"faizabad"}>Faizabad</MenuItem>
                    <MenuItem value={"farrukhabad"}>Farrukhabad</MenuItem>
                    <MenuItem value={"fatehpur"}>Fatehpur</MenuItem>
                    <MenuItem value={"firozabad"}>Firozabad</MenuItem>
                    <MenuItem value={"gautam-buddha-nagar"}>
                      Gautam Buddha Nagar
                    </MenuItem>
                    <MenuItem value={"ghaziabad"}>Ghaziabad</MenuItem>
                    <MenuItem value={"ghazipur"}>Ghazipur</MenuItem>
                    <MenuItem value={"gonda"}>Gonda</MenuItem>
                    <MenuItem value={"gorakhpur"}>Gorakhpur</MenuItem>
                    <MenuItem value={"hamirpur"}>Hamirpur</MenuItem>
                    <MenuItem value={"hapur"}>Hapur</MenuItem>
                    <MenuItem value={"hardoi"}>Hardoi</MenuItem>
                    <MenuItem value={"hathras"}>Hathras</MenuItem>
                    <MenuItem value={"jalaun"}>Jalaun</MenuItem>
                    <MenuItem value={"jaunpur"}>Jaunpur</MenuItem>
                    <MenuItem value={"jhansi"}>Jhansi</MenuItem>
                    <MenuItem value={"kannauj"}>Kannauj</MenuItem>
                    <MenuItem value={"kanpur-dehat"}>Kanpur Dehat</MenuItem>
                    <MenuItem value={"kanpur-nagar"}>Kanpur Nagar</MenuItem>
                    <MenuItem value={"kasganj"}>Kasganj</MenuItem>
                    <MenuItem value={"kaushambi"}>Kaushambi</MenuItem>
                    <MenuItem value={"kheri"}>Kheri</MenuItem>
                    <MenuItem value={"kushinagar"}>Kushinagar</MenuItem>
                    <MenuItem value={"lalitpur"}>Lalitpur</MenuItem>
                    <MenuItem value={"lucknow"}>Lucknow</MenuItem>
                    <MenuItem value={"maharajganj"}>Maharajganj</MenuItem>
                    <MenuItem value={"mahoba"}>Mahoba</MenuItem>
                    <MenuItem value={"mainpuri"}>Mainpuri</MenuItem>
                    <MenuItem value={"mathura"}>Mathura</MenuItem>
                    <MenuItem value={"mau"}>Mau</MenuItem>
                    <MenuItem value={"meerut"}>Meerut</MenuItem>
                    <MenuItem value={"mirzapur"}>Mirzapur</MenuItem>
                    <MenuItem value={"moradabad"}>Moradabad</MenuItem>
                    <MenuItem value={"muzaffarnagar"}>Muzaffarnagar</MenuItem>
                    <MenuItem value={"pilibhit"}>Pilibhit</MenuItem>
                    <MenuItem value={"pratapgarh"}>Pratapgarh</MenuItem>
                    <MenuItem value={"prayagraj"}>Prayagraj</MenuItem>
                    <MenuItem value={"raebareli"}>Raebareli</MenuItem>
                    <MenuItem value={"rampur"}>Rampur</MenuItem>
                    <MenuItem value={"saharanpur"}>Saharanpur</MenuItem>
                    <MenuItem value={"sambhal"}>Sambhal</MenuItem>
                    <MenuItem value={"sant-kabir-nagar"}>
                      Sant Kabir Nagar
                    </MenuItem>
                    <MenuItem value={"sant-ravidas-nagar"}>
                      Sant Ravidas Nagar
                    </MenuItem>
                    <MenuItem value={"shahjahanpur"}>Shahjahanpur</MenuItem>
                    <MenuItem value={"shamli"}>Shamli</MenuItem>
                    <MenuItem value={"shravasti"}>Shravasti</MenuItem>
                    <MenuItem value={"siddharthnagar"}>Siddharthnagar</MenuItem>
                    <MenuItem value={"sitapur"}>Sitapur</MenuItem>
                    <MenuItem value={"sonbhadra"}>Sonbhadra</MenuItem>
                    <MenuItem value={"sultanpur"}>Sultanpur</MenuItem>
                    <MenuItem value={"unnao"}>Unnao</MenuItem>
                    <MenuItem value={"varanasi"}>Varanasi</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {formData.state === "uttarakhand" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"almora"}>Almora</MenuItem>
                    <MenuItem value={"bageshwar"}>Bageshwar</MenuItem>
                    <MenuItem value={"chamoli"}>Chamoli</MenuItem>
                    <MenuItem value={"champawat"}>Champawat</MenuItem>
                    <MenuItem value={"dehradun"}>Dehradun</MenuItem>
                    <MenuItem value={"haridwar"}>Haridwar</MenuItem>
                    <MenuItem value={"nainital"}>Nainital</MenuItem>
                    <MenuItem value={"pauri-garhwal"}>Pauri Garhwal</MenuItem>
                    <MenuItem value={"pithoragarh"}>Pithoragarh</MenuItem>
                    <MenuItem value={"rudraprayag"}>Rudraprayag</MenuItem>
                    <MenuItem value={"tehri-garhwal"}>Tehri Garhwal</MenuItem>
                    <MenuItem value={"udhamsingh-nagar"}>
                      Udham Singh Nagar
                    </MenuItem>
                    <MenuItem value={"uttarkashi"}>Uttarkashi</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "west-bengal" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"alipurduar"}>Alipurduar</MenuItem>
                    <MenuItem value={"bankura"}>Bankura</MenuItem>
                    <MenuItem value={"birbhum"}>Birbhum</MenuItem>
                    <MenuItem value={"cooch-behar"}>Cooch Behar</MenuItem>
                    <MenuItem value={"dakshin-dinajpur"}>
                      Dakshin Dinajpur
                    </MenuItem>
                    <MenuItem value={"darjeeling"}>Darjeeling</MenuItem>
                    <MenuItem value={"hooghly"}>Hooghly</MenuItem>
                    <MenuItem value={"howrah"}>Howrah</MenuItem>
                    <MenuItem value={"jalpaiguri"}>Jalpaiguri</MenuItem>
                    <MenuItem value={"jhargram"}>Jhargram</MenuItem>
                    <MenuItem value={"kalimpong"}>Kalimpong</MenuItem>
                    <MenuItem value={"kolkata"}>Kolkata</MenuItem>
                    <MenuItem value={"malda"}>Malda</MenuItem>
                    <MenuItem value={"murshidabad"}>Murshidabad</MenuItem>
                    <MenuItem value={"nadia"}>Nadia</MenuItem>
                    <MenuItem value={"north-24-parganas"}>
                      North 24 Parganas
                    </MenuItem>
                    <MenuItem value={"paschim-bardhaman"}>
                      Paschim Bardhaman
                    </MenuItem>
                    <MenuItem value={"paschim-medinipur"}>
                      Paschim Medinipur
                    </MenuItem>
                    <MenuItem value={"purba-bardhaman"}>
                      Purba Bardhaman
                    </MenuItem>
                    <MenuItem value={"purba-medinipur"}>
                      Purba Medinipur
                    </MenuItem>
                    <MenuItem value={"purulia"}>Purulia</MenuItem>
                    <MenuItem value={"south-24-parganas"}>
                      South 24 Parganas
                    </MenuItem>
                    <MenuItem value={"uttar-dinajpur"}>Uttar Dinajpur</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "kerala" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District{" "}
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"alappuzha"}>Alappuzha</MenuItem>
                    <MenuItem value={"ernakulam"}>Ernakulam</MenuItem>
                    <MenuItem value={"idukki"}>Idukki</MenuItem>
                    <MenuItem value={"kannur"}>Kannur</MenuItem>
                    <MenuItem value={"kasaragod"}>Kasaragod</MenuItem>
                    <MenuItem value={"kollam"}>Kollam</MenuItem>
                    <MenuItem value={"kottayam"}>Kottayam</MenuItem>
                    <MenuItem value={"kozhikode"}>Kozhikode</MenuItem>
                    <MenuItem value={"malappuram"}>Malappuram</MenuItem>
                    <MenuItem value={"palakkad"}>Palakkad</MenuItem>
                    <MenuItem value={"pathanamthitta"}>Pathanamthitta</MenuItem>
                    <MenuItem value={"thiruvananthapuram"}>
                      Thiruvananthapuram
                    </MenuItem>
                    <MenuItem value={"thrissur"}>Thrissur</MenuItem>
                    <MenuItem value={"wayanad"}>Wayanad</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.state === "tamil-nadu" && (
              <>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    District{" "}
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.district}
                    label="District"
                    name="district"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"ariyalur"}>Ariyalur</MenuItem>
                    <MenuItem value={"chengalpattu"}>Chengalpattu</MenuItem>
                    <MenuItem value={"chennai"}>Chennai</MenuItem>
                    <MenuItem value={"coimbatore"}>Coimbatore</MenuItem>
                    <MenuItem value={"cuddalore"}>Cuddalore</MenuItem>
                    <MenuItem value={"dharmapuri"}>Dharmapuri</MenuItem>
                    <MenuItem value={"dindigul"}>Dindigul</MenuItem>
                    <MenuItem value={"erode"}>Erode</MenuItem>
                    <MenuItem value={"kallakurichi"}>Kallakurichi</MenuItem>
                    <MenuItem value={"kancheepuram"}>Kancheepuram</MenuItem>
                    <MenuItem value={"karur"}>Karur</MenuItem>
                    <MenuItem value={"krishnagiri"}>Krishnagiri</MenuItem>
                    <MenuItem value={"madurai"}>Madurai</MenuItem>
                    <MenuItem value={"nagapattinam"}>Nagapattinam</MenuItem>
                    <MenuItem value={"namakkal"}>Namakkal</MenuItem>
                    <MenuItem value={"nilgiris"}>Nilgiris</MenuItem>
                    <MenuItem value={"perambalur"}>Perambalur</MenuItem>
                    <MenuItem value={"pudukkottai"}>Pudukkottai</MenuItem>
                    <MenuItem value={"ramanathapuram"}>Ramanathapuram</MenuItem>
                    <MenuItem value={"ranipet"}>Ranipet</MenuItem>
                    <MenuItem value={"salem"}>Salem</MenuItem>
                    <MenuItem value={"sivaganga"}>Sivaganga</MenuItem>
                    <MenuItem value={"tenkasi"}>Tenkasi</MenuItem>
                    <MenuItem value={"thanjavur"}>Thanjavur</MenuItem>
                    <MenuItem value={"theni"}>Theni</MenuItem>
                    <MenuItem value={"thoothukudi"}>Thoothukudi</MenuItem>
                    <MenuItem value={"tiruchirappalli"}>
                      Tiruchirappalli
                    </MenuItem>
                    <MenuItem value={"tirunelveli"}>Tirunelveli</MenuItem>
                    <MenuItem value={"tirupattur"}>Tirupattur</MenuItem>
                    <MenuItem value={"tiruppur"}>Tiruppur</MenuItem>
                    <MenuItem value={"tiruvallur"}>Tiruvallur</MenuItem>
                    <MenuItem value={"tiruvannamalai"}>Tiruvannamalai</MenuItem>
                    <MenuItem value={"tiruvarur"}>Tiruvarur</MenuItem>
                    <MenuItem value={"vellore"}>Vellore</MenuItem>
                    <MenuItem value={"viluppuram"}>Viluppuram</MenuItem>
                    <MenuItem value={"virudhunagar"}>Virudhunagar</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            <PasswordField
              style={{ backgroundColor: "white", borderRadius: "8px" }}
              passwordError={errors.password}
              confirmPasswordError={errors.confirmPassword}
              onPasswordChange={handleChange}
              onConfirmPasswordChange={handleChange}
            />
            <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
              <InputLabel id="demo-simple-select-helper-label">
                Select Role
              </InputLabel>
              <Select
                style={{ backgroundColor: "white", borderRadius: "8px" }}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={formData.role}
                label="Select Role"
                name="role"
                onChange={handleChange}
              >
                <MenuItem value="" disabled>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"patient"}>I'm a Patient</MenuItem>
                <MenuItem value={"doctor"}>I'm a Doctor</MenuItem>
              </Select>
              {/* <FormHelperText>With label + helper text</FormHelperText> */}
            </FormControl>
            {/* Professional Information */}
            {formData.role === "doctor" && (
              <>
                <hr />
                <h2 className="text">Professional Information</h2>
                <TextField
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  fullWidth
                  label="Medical License Number "
                  id="fullWidth"
                  name="medicalLicenseNumber"
                  onChange={handleChange}
                />
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Specialization
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.specialization}
                    label="Specialization"
                    name="specialization"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Anesthesiology">Anesthesiology</MenuItem>
                    <MenuItem value="Cardiology">Cardiology</MenuItem>
                    <MenuItem value="Dermatology">Dermatology</MenuItem>
                    <MenuItem value="Emergency Medicine">
                      Emergency Medicine
                    </MenuItem>
                    <MenuItem value="Endocrinology">Endocrinology</MenuItem>
                    <MenuItem value="Gastroenterology">
                      Gastroenterology
                    </MenuItem>
                    <MenuItem value="General Surgery">General Surgery</MenuItem>
                    <MenuItem value="Geriatrics">Geriatrics</MenuItem>
                    <MenuItem value="Hematology">Hematology</MenuItem>
                    <MenuItem value="Infectious Disease">
                      Infectious Disease
                    </MenuItem>
                    <MenuItem value="Internal Medicine">
                      Internal Medicine
                    </MenuItem>
                    <MenuItem value="Nephrology">Nephrology</MenuItem>
                    <MenuItem value="Neurology">Neurology</MenuItem>
                    <MenuItem value="Obstetrics and Gynecology">
                      Obstetrics and Gynecology
                    </MenuItem>
                    <MenuItem value="Oncology">Oncology</MenuItem>
                    <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
                    <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                    <MenuItem value="Otolaryngology (ENT)">
                      Otolaryngology (ENT)
                    </MenuItem>
                    <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                    <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                    <MenuItem value="Pulmonology">Pulmonology</MenuItem>
                    <MenuItem value="Radiology">Radiology</MenuItem>
                    <MenuItem value="Rheumatology">Rheumatology</MenuItem>
                    <MenuItem value="Urology">Urology</MenuItem>
                  </Select>
                  <FormHelperText>
                    {" "}
                    {formData.specialization.map((item, index) => (
                      <Box
                        key={index}
                        component="span"
                        style={{
                          border: "1px solid",
                          padding: "5px",
                          borderRadius: "5px",
                          margin: "5px",
                          display: "inline-block",
                        }}
                        className="text"
                      >
                        {item}
                        <span
                          style={{
                            marginLeft: "10px",
                            cursor: "pointer",
                            color: "red",
                          }}
                          onClick={() =>
                            handleRemoveItem("specialization", item)
                          }
                        >
                          X
                        </span>
                      </Box>
                    ))}
                  </FormHelperText>
                </FormControl>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Qualification
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.qualification}
                    label="Qualification"
                    name="qualification"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="MBBS">
                      MBBS (Bachelor of Medicine, Bachelor of Surgery)
                    </MenuItem>
                    <MenuItem value="BDS">
                      BDS (Bachelor of Dental Surgery)
                    </MenuItem>
                    <MenuItem value="BAMS">
                      BAMS (Bachelor of Ayurvedic Medicine and Surgery)
                    </MenuItem>
                    <MenuItem value="BHMS">
                      BHMS (Bachelor of Homeopathic Medicine and Surgery)
                    </MenuItem>
                    <MenuItem value="BUMS">
                      BUMS (Bachelor of Unani Medicine and Surgery)
                    </MenuItem>
                    <MenuItem value="BSMS">
                      BSMS (Bachelor of Siddha Medicine and Surgery)
                    </MenuItem>
                    <MenuItem value="BNYS">
                      BNYS (Bachelor of Naturopathy and Yogic Sciences)
                    </MenuItem>
                    <MenuItem value="MD">
                      MD (Doctor of Medicine - Specialization)
                    </MenuItem>
                    <MenuItem value="MS">MS (Master of Surgery)</MenuItem>
                    <MenuItem value="DM">
                      DM (Doctorate of Medicine - Super Specialization)
                    </MenuItem>
                    <MenuItem value="MCh">
                      MCh (Master of Chirurgiae - Super Specialization)
                    </MenuItem>
                    <MenuItem value="DNB">
                      DNB (Diplomate of National Board)
                    </MenuItem>
                    <MenuItem value="Fellowship">
                      Fellowship in Medical Specialties
                    </MenuItem>
                    <MenuItem value="PGD">
                      PG Diploma in Medical Specialties
                    </MenuItem>
                    <MenuItem value="PhD">PhD in Medical Sciences</MenuItem>
                    <MenuItem value="MDS">
                      MDS (Master of Dental Surgery)
                    </MenuItem>
                    <MenuItem value="MSc">MSc in Medical Sciences</MenuItem>
                    <MenuItem value="DGO">
                      DGO (Diploma in Obstetrics and Gynaecology)
                    </MenuItem>
                    <MenuItem value="DCH">
                      DCH (Diploma in Child Health)
                    </MenuItem>
                    <MenuItem value="DOMS">
                      DOMS (Diploma in Ophthalmic Medicine & Surgery)
                    </MenuItem>
                    <MenuItem value="DA">
                      DA (Diploma in Anesthesiology)
                    </MenuItem>
                    <MenuItem value="DLO">
                      DLO (Diploma in Otorhinolaryngology - ENT)
                    </MenuItem>
                    <MenuItem value="DPM">
                      DPM (Diploma in Psychological Medicine)
                    </MenuItem>
                    <MenuItem value="DVD">
                      DVD (Diploma in Venereology & Dermatology)
                    </MenuItem>
                    <MenuItem value="DO">
                      DO (Diploma in Ophthalmology)
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    {formData.qualification.map((item, index) => (
                      <Box
                        key={index}
                        component="span"
                        style={{
                          border: "1px solid",
                          padding: "5px",
                          borderRadius: "5px",
                          margin: "5px",
                          display: "inline-block",
                        }}
                        className="text"
                      >
                        {item}
                        <span
                          style={{
                            marginLeft: "10px",
                            cursor: "pointer",
                            color: "red",
                          }}
                          onClick={() =>
                            handleRemoveItem("qualification", item)
                          }
                        >
                          X
                        </span>
                      </Box>
                    ))}
                  </FormHelperText>
                </FormControl>
                <TextField
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  fullWidth
                  label="Years of Experience"
                  id="fullWidth"
                  name="yearOfExperience"
                  onChange={handleChange}
                />
                <TextField
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  fullWidth
                  label="Hospital/Clinic Affiliation"
                  id="fullWidth"
                  name="hospitalName"
                  onChange={handleChange}
                />
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Registration Authority
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.registrationAuthority}
                    label="Registration Authority"
                    name="registrationAuthority"
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"mci"}>MCI</MenuItem>
                    <MenuItem value={"nmc"}>NMC</MenuItem>
                    <MenuItem value={"ama"}>AMA</MenuItem>
                    <MenuItem value={"gmc"}>GMC - UK</MenuItem>
                    <MenuItem value={"pmc"}>PMC</MenuItem>
                    <MenuItem value={"apmc"}>AHPRA</MenuItem>
                    <MenuItem value={"cpsbc"}>CPSBC - Canada</MenuItem>
                    <MenuItem value={"smc"}>SMC</MenuItem>
                    <MenuItem value={"nmc_nepal"}>NMC - Nepal</MenuItem>
                    <MenuItem value={"pmdc"}>PMDC</MenuItem>
                    <MenuItem value={"usmle"}>USMLE</MenuItem>
                    <MenuItem value={"cmc"}>CMC</MenuItem>
                    <MenuItem value={"hpcsa"}>HPCSA</MenuItem>
                    <MenuItem value={"mmc"}>MMC</MenuItem>
                    <MenuItem value={"bmrc"}>BMDC</MenuItem>
                    <MenuItem value={"imd"}>IMC</MenuItem>
                    <MenuItem value={"dmc"}>DHA</MenuItem>
                    <MenuItem value={"scfhs"}>SCFHS</MenuItem>
                    <MenuItem value={"qchp"}>QCHP</MenuItem>

                    <MenuItem value={"nhra"}>NHRA - Bahrain</MenuItem>
                  </Select>
                  {/* <FormHelperText>With label + helper text</FormHelperText> */}
                </FormControl>
                <TextField
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  fullWidth
                  label="Registration Number"
                  id="fullWidth"
                  name="registrationNumber"
                  onChange={handleChange}
                />
                {/* Practice Information */}
                <hr />
                <h2 className="text">Practice Information</h2>
                <h3 style={{ marginLeft: "10px" }} className="text">
                  Consultation Fees
                </h3>
                <FormHelperText>
                  <InfoOutlinedIcon
                    style={{ color: "#005599" }}
                    className="text"
                  />
                  <span className="text">Consultation Fees for 15 minutes</span>
                </FormHelperText>
                <TextField
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  fullWidth
                  label="Enter consultation charges for in-person"
                  id="fullWidth"
                  name="consultationFee.inPerson"
                  onChange={handleChange}
                />
                <TextField
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  fullWidth
                  label="Enter consultation charges for video"
                  id="fullWidth"
                  name="consultationFee.video"
                  onChange={handleChange}
                />
                <TextField
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  fullWidth
                  label="Enter consultation charges for teleconsultation"
                  id="fullWidth"
                  name="consultationFee.teleconsultation"
                  onChange={handleChange}
                />
                <h3 style={{ marginLeft: "10px" }} className="text">
                  Available Consultation Types
                </h3>
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                >
                  <Checkbox
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    type="checkbox"
                    color="success"
                    onChange={handleChange}
                    name="availableConsultations.inPerson"
                    checked={formData.availableConsultations.inPerson}
                  />
                  <label>In-Person Consultation</label>
                  <br />
                  <Checkbox
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    type="checkbox"
                    color="success"
                    onChange={handleChange}
                    name="availableConsultations.video"
                    checked={formData.availableConsultations.video}
                  />
                  <label>Video Consultation</label>
                  <br />
                  <Checkbox
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    type="checkbox"
                    color="success"
                    onChange={handleChange}
                    name="availableConsultations.teleconsultation"
                    checked={formData.availableConsultations.teleconsultation}
                  />

                  <label>Teleconsultation</label>
                </div>
                <h3 style={{ marginLeft: "10px" }} className="text">
                  Availability Schedule
                </h3>
                <FormHelperText>
                  <InfoOutlinedIcon style={{ color: "#005599" }} />
                  <span className="text">
                    12:00 PM to 02:00 PM will be break.
                  </span>
                </FormHelperText>
                <table
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  border="1"
                >
                  <tr>
                    <th>Day</th>
                    <th>Available</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                  </tr>
                  <tr>
                    <td>Monday</td>
                    <td>
                      No{" "}
                      <Switch
                        defaultChecked
                        onChange={handleChange}
                        name="availabilitySchedule.monday.available"
                      />{" "}
                      Yes
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.monday.startTime"
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.monday.endTime"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Tuesday</td>
                    <td>
                      No{" "}
                      <Switch
                        defaultChecked
                        onChange={handleChange}
                        name="availabilitySchedule.tuesday.available"
                      />{" "}
                      Yes
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.tuesday.startTime"
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.tuesday.endTime"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Wednesday</td>
                    <td>
                      No{" "}
                      <Switch
                        defaultChecked
                        onChange={handleChange}
                        name="availabilitySchedule.wednesday.available"
                      />{" "}
                      Yes
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.wednesday.startTime"
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.wednesday.endTime"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Thursday</td>
                    <td>
                      No{" "}
                      <Switch
                        defaultChecked
                        onChange={handleChange}
                        name="availabilitySchedule.thursday.available"
                      />{" "}
                      Yes
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.thursday.startTime"
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.thursday.endTime"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Friday</td>
                    <td>
                      No{" "}
                      <Switch
                        defaultChecked
                        onChange={handleChange}
                        name="availabilitySchedule.friday.available"
                      />{" "}
                      Yes
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.friday.startTime"
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.friday.endTime"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Saturday</td>
                    <td>
                      No{" "}
                      <Switch
                        onChange={handleChange}
                        name="availabilitySchedule.saturday.available"
                      />{" "}
                      Yes
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.saturday.startTime"
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.saturday.endTime"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Sunday</td>
                    <td>
                      No{" "}
                      <Switch
                        onChange={handleChange}
                        name="availabilitySchedule.sunday.available"
                      />{" "}
                      Yes
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.sunday.startTime"
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        onChange={handleChange}
                        name="availabilitySchedule.sunday.endTime"
                      />
                    </td>
                  </tr>
                </table>
                <h3
                  style={{ marginLeft: "10px", marginTop: "20px" }}
                  className="text"
                >
                  Clinic Address (Optional)
                </h3>
                <FormHelperText>
                  <InfoOutlinedIcon style={{ color: "#005599" }} />
                  <spna className="text">
                    {" "}
                    For doctors offering in-person consultations.
                  </spna>
                </FormHelperText>
                <TextField
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  id="outlined-textarea"
                  label="Clinic Address"
                  placeholder="Enter address here."
                  fullWidth
                  multiline
                  name="clinicAddress"
                  onChange={handleChange}
                />
                {/* Supporting Documents */}
                <hr />
                <h2 className="text">Supporting Documents</h2>
                <table
                  style={{ backgroundColor: "white", borderRadius: "8px" }}
                >
                  <tr>
                    <td>
                      <label style={{ marginTop: "10px" }}>
                        Medical License Document
                      </label>
                    </td>
                    <td>
                      <input
                        type="file"
                        accept="application/pdf, image/*"
                        onChange={handleFileUpload}
                        name="medicalLicenseDocument"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label style={{ marginTop: "10px" }}>
                        Degree Certificates
                      </label>
                    </td>
                    <td>
                      <input
                        type="file"
                        accept="application/pdf, image/*"
                        onChange={handleFileUpload}
                        name="degreeCertificate"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label style={{ marginTop: "10px" }}>
                        Government ID Proof
                      </label>
                    </td>
                    <td>
                      <input
                        type="file"
                        accept="application/pdf, image/*"
                        onChange={handleFileUpload}
                        name="governmentIdProof"
                      />
                    </td>
                  </tr>
                </table>
                <FormHelperText>
                  <InfoOutlinedIcon style={{ color: "#005599" }} />
                  <span className="text">e.g., passport, national ID</span>
                </FormHelperText>
                {/* Additional Details */}
                <hr />
                <h2 className="text">Additional Details</h2>
                <h3 className="text">Languages Spoken</h3>
                <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Languages
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={formData.language}
                    name="language"
                    onChange={handleChange}
                    label="Language"
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Arabic">Arabic</MenuItem>
                    <MenuItem value="Assamese">Assamese</MenuItem>
                    <MenuItem value="Bengali">Bengali</MenuItem>
                    <MenuItem value="Bodo">Bodo</MenuItem>
                    <MenuItem value="Dogri">Dogri</MenuItem>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Gujarati">Gujarati</MenuItem>
                    <MenuItem value="Hindi">Hindi</MenuItem>
                    <MenuItem value="Japanese">Japanese</MenuItem>

                    <MenuItem value="Kannada">Kannada</MenuItem>
                    <MenuItem value="Kashmiri">Kashmiri</MenuItem>
                    <MenuItem value="Konkani">Konkani</MenuItem>
                    <MenuItem value="Maithili">Maithili</MenuItem>
                    <MenuItem value="Malayalam">Malayalam</MenuItem>
                    <MenuItem value="Manipuri">Manipuri</MenuItem>
                    <MenuItem value="Marathi">Marathi</MenuItem>
                    <MenuItem value="Nepali">Nepali</MenuItem>
                    <MenuItem value="Odia">Odia</MenuItem>
                    <MenuItem value="Punjabi">Punjabi</MenuItem>
                    <MenuItem value="Sanskrit">Sanskrit</MenuItem>
                    <MenuItem value="Santali">Santali</MenuItem>
                    <MenuItem value="Sindhi">Sindhi</MenuItem>
                    <MenuItem value="Tamil">Tamil</MenuItem>
                    <MenuItem value="Telugu">Telugu</MenuItem>
                    <MenuItem value="Urdu">Urdu</MenuItem>
                  </Select>
                  <FormHelperText>
                    {formData.language.map((item, index) => (
                      <Box
                        key={index}
                        component="span"
                        style={{
                          border: "1px solid",
                          padding: "5px",
                          borderRadius: "5px",
                          margin: "5px",
                          display: "inline-block",
                        }}
                        className="text"
                      >
                        {item}
                        <span
                          style={{
                            marginLeft: "10px",
                            cursor: "pointer",
                            color: "red",
                          }}
                          onClick={() => handleRemoveItem("language", item)}
                        >
                          X
                        </span>
                      </Box>
                    ))}
                  </FormHelperText>
                </FormControl>
                <h3 className="text">Short Bio/Description</h3>
                <TextField
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  id="outlined-textarea"
                  label="Description"
                  placeholder="Brief introduction or professional summary."
                  fullWidth
                  multiline
                  name="shortBio"
                  onChange={handleChange}
                />
                <h3 style={{ marginTop: "20px" }} className="text">
                  Profile Links (Optional)
                </h3>
                <FormHelperText>
                  <InfoOutlinedIcon style={{ color: "#005599" }} />
                  <span className="text">
                    LinkedIn or personal website links (if available).
                  </span>
                </FormHelperText>
                <TextField
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  fullWidth
                  label="LinkedIn address"
                  id="fullWidth"
                  name="profileLinks.linkedin"
                  onChange={handleChange}
                />
                <TextField
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                  fullWidth
                  label="Website address"
                  id="fullWidth"
                  name="profileLinks.website"
                  onChange={handleChange}
                />
              </>
            )}
            <table
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                marginTop: "20px",
              }}
            >
              <tr>
                <td>
                  <Checkbox
                    style={{ backgroundColor: "white", borderRadius: "8px" }}
                    name="agreed"
                    checked={formData.agreed}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        agreed: e.target.checked,
                      }))
                    }
                  />
                </td>
                <td>
                  Agree Terms and Conditions, Users must agree to terms and
                  privacy policy before registering.
                </td>
              </tr>
            </table>
            {errors.agreed && (
              <p
                style={{ color: "red", textAlign: "center", marginTop: "20px" }}
              >
                {errors.agreed}
              </p>
            )}
            {errorMessage && (
              <p
                style={{ color: "red", textAlign: "center", marginTop: "20px" }}
              >
                {errorMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              class="btn btn-primary"
              style={{ marginTop: "20px", width: "100%", fontWeight: "bold" }}
              // onClick={handleSubmit}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <center>
              <label
                style={{
                  marginTop: "20px",
                  marginBottom: "100px",
                }}
                className="text"
              >
                Already have an account?
                <a style={{ cursor: "pointer", textDecoration: "underline" }}>
                  <Link to="/login"> Login here.</Link>
                </a>
              </label>
            </center>
          </form>
        </Box>
      </div>
    </>
  );
};

export default Registration;
