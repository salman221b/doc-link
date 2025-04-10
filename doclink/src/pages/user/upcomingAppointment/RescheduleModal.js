// RescheduleModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RescheduleModal = ({ show, handleClose, appointment, onReschedule }) => {
  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
  });
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14); // Allow selection up to 2 weeks ahead
  const maxDateFormatted = maxDate.toISOString().split("T")[0];
  const [error, setError] = useState(false);

  useEffect(() => {
    if (appointment) {
      setFormData({
        scheduledDate: appointment.scheduledDate?.slice(0, 10),
        scheduledTime: appointment.scheduledTime || "",
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onReschedule(appointment._id, formData);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Reschedule Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>New Date</Form.Label>
            <Form.Control
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              required
              min={today}
              max={maxDateFormatted}
              error={error}
              helperText={error ? "Doctor is not available on this day." : ""}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>New Time</Form.Label>
            <Form.Control
              type="time"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button className="mt-4" type="submit" variant="primary" block>
            Confirm Reschedule
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RescheduleModal;
