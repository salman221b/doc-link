const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Doctor = require("../models/doctorsModel");
const Otp = require("../models/otpModel");

const sendOtpEmail = require("../otp_verification/sendOtpEmail");

const registerDoctor = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    age,
    phone,
    state,
    district,
    password,
    confirmPassword,
    role,
    medicalLicenseNumber,
    specialization,
    qualification,
    yearOfExperience,
    hospitalName,
    registrationAuthority,
    registrationNumber,
    consultationFee,
    availableConsultations,
    availabilitySchedule,
    clinicAddress,
    language,
    shortBio,
    profileLinks,
    agreed,
  } = req.body;
  // console.log("Uploaded values", req.body);
  // console.log(req.files);

  const medicalLicenseFile = req.files?.medicalLicenseDocument?.[0];
  const degreeCertificateFile = req.files?.degreeCertificate?.[0];
  const governmentIdFile = req.files?.governmentIdProof?.[0];
  // console.log(medicalLicenseFile.path);
  // console.log("Uploaded Files:", req.files);
  // return res.send(req.body);
  // console.log("First name", firstName);
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !state ||
    !medicalLicenseNumber ||
    !specialization ||
    !qualification ||
    !yearOfExperience ||
    !hospitalName ||
    !registrationAuthority ||
    !registrationNumber
  ) {
    console.error("Missing fields in the request body.");

    return res.status(400).json({ errorMessage: "All fields are mandatory" });
  }
  if (password !== confirmPassword) {
    console.error("Password mismatch.");

    return res
      .status(400)
      .json({ errorMessage: "Password and Confirm Password do not match" });
  }
  const existingUser = await Doctor.findOne({ email });
  if (existingUser) {
    console.error("User already exists with this email.");

    return res.status(400).json({ errorMessage: "User already exists" });
  }
  if (!medicalLicenseFile || !degreeCertificateFile || !governmentIdFile) {
    return res
      .status(400)
      .json({ errorMessage: "All document files are mandatory" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const generateOtp = () => {
      return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
    };
    const otp = generateOtp();

    const consultationFeeObj = JSON.parse(consultationFee);
    const availableConsultationsObj = JSON.parse(availableConsultations);
    const availabilityScheduleObj = JSON.parse(availabilitySchedule);
    const languageObj = JSON.parse(language);
    const profileLinksObj = JSON.parse(profileLinks);

    const doctor = await Doctor.create({
      firstName,
      lastName,
      email,
      age,
      phone,
      state,
      district,
      password: hashedPassword,
      role,
      medicalLicenseNumber,
      specialization,
      qualification,
      yearOfExperience,
      hospitalName,
      registrationAuthority,
      registrationNumber,
      consultationFee: {
        inPerson: consultationFeeObj.inPerson,
        video: consultationFeeObj.video,
        teleconsultation: consultationFeeObj.teleconsultation,
      },
      availableConsultations: {
        inPerson: availableConsultationsObj.inPerson,
        video: availableConsultationsObj.video,
        teleconsultation: availableConsultationsObj.teleconsultation,
      },
      availabilitySchedule: availabilityScheduleObj,
      clinicAddress,
      medicalLicenseDocument: {
        file_name: medicalLicenseFile.originalname,
        file_type: medicalLicenseFile.mimetype,
        file_data: medicalLicenseFile.path, // Store the path
      },
      degreeCertificate: {
        file_name: degreeCertificateFile.originalname,
        file_type: degreeCertificateFile.mimetype,
        file_data: degreeCertificateFile.path, // Store the path
      },
      governmentIdProof: {
        file_name: governmentIdFile.originalname,
        file_type: governmentIdFile.mimetype,
        file_data: governmentIdFile.path, // Store the path
      },
      language: languageObj,
      shortBio,
      profileLinks: profileLinksObj,
      verified: false,
      agreed,
    });
    sendOtpEmail.sendOtpEmail(firstName, email, otp);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

    await Otp.create({ email, otp, role, expiresAt });

    res.status(201).json({
      id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
    });
  } catch (error) {
    console.error("Error during doctor registration:", error);

    // Handle unexpected errors
    res.status(500).json({ errorMessage: "Server error. Please try again." });
  }
});

module.exports = { registerDoctor };
