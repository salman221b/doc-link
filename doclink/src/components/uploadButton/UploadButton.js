import React, { useState } from "react";
import { Fab } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { Modal, Button, Form } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadButton() {
  const [show, setShow] = useState(false);
  const token = localStorage.getItem("token");

  const decoded = token ? jwtDecode(token) : null;

  const patientId = decoded?.id; // Extract user ID

  const [medicalRecords, setMedicalRecords] = useState({
    file: {},
    fileName: "",
    category: "",
    remarks: "",
    patientId: patientId,
  });
  const handleClose = () => {
    setShow(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", medicalRecords.file);
    formData.append("fileName", medicalRecords.fileName);
    formData.append("category", medicalRecords.category);
    formData.append("remarks", medicalRecords.remarks);
    formData.append("patientId", patientId);

    try {
      const res = await fetch(
        "https://doc-link-backend.onrender.com/medical-records",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        window.location.reload();
        toast.success(data.message);
        setShow(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error uploading:", err);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "90px",
        right: "25px",
        zIndex: 1000,
      }}
    >
      <Fab color="primary" component="label" aria-label="upload">
        <CloudUpload onClick={() => setShow(true)} />
      </Fab>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add A New Medical Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>
                Select File<Form.Text className="text-danger"> *</Form.Text>
              </Form.Label>
              <Form.Control
                type="file"
                name="file"
                required
                onChange={(e) =>
                  setMedicalRecords((prev) => ({
                    ...prev,
                    file: e.target.files[0], // Get the file object
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Name<Form.Text className="text-danger"> *</Form.Text>
              </Form.Label>
              <Form.Control
                onChange={(e) =>
                  setMedicalRecords((prev) => ({
                    ...prev,
                    fileName: e.target.value,
                  }))
                }
                type="text"
                name="fileName"
                placeholder="Enter File Name"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Category <Form.Text className="text-danger"> *</Form.Text>
              </Form.Label>
              <Form.Control
                as="select"
                name="category"
                required
                onChange={(e) =>
                  setMedicalRecords((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                <option value="" disabled selected>
                  Select Category
                </option>
                <option value="X Ray">X Ray</option>
                <option value="MRI Scan">MRI Scan</option>
                <option value="CT Scan">CT Scan</option>
                <option value="Ultrasound">Ultrasound</option>
                <option value="ECG">ECG</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Rmarks</Form.Label>
              <Form.Control
                type="text"
                name="remarks"
                onChange={(e) =>
                  setMedicalRecords((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                  }))
                }
              />
            </Form.Group>

            <div style={{ textAlign: "center" }}>
              <Button className="mt-4" type="submit" variant="success" block>
                Add Medical Record
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
