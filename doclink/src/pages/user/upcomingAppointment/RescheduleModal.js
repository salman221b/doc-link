// RescheduleModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RescheduleModal = ({ show, handleClose, appointment, onReschedule }) => {
  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
  });

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
