// RescheduleModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RescheduleModal = ({ show, handleClose, appointment, onReschedule }) => {
  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
  });
  const [selectedDate, setSelectedDate] = useState("");

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
  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    const dayName = new Date(newDate)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    console.log("Selected Day:", dayName);

    // if (selectedDoctor && doctorAvailability[dayName]?.available) {
    //   let startTime = doctorAvailability[dayName].startTime; // e.g., "09:00"
    //   let endTime = doctorAvailability[dayName].endTime; // e.g., "17:00"

    //   if (startTime && endTime) {
    //     let slots = [];
    //     let [startHour, startMinute] = startTime.split(":").map(Number);
    //     let [endHour, endMinute] = endTime.split(":").map(Number);

    //     let startMinutes = startHour * 60 + startMinute;
    //     let endMinutes = endHour * 60 + endMinute;

    //     for (let i = startMinutes; i < endMinutes; i += 30) {
    //       let hours = Math.floor(i / 60);
    //       let minutes = i % 60;
    //       let formattedTime = `${String(hours).padStart(2, "0")}:${String(
    //         minutes
    //       ).padStart(2, "0")}`;
    //       if (formattedTime !== "13:00" && formattedTime !== "13:30") {
    //         slots.push(formattedTime);
    //       }
    //     }

    //     console.log("Available Slots:", slots);
    //     setAvailableSlots(slots);
    //   }
    // }

    // if (isDateDisabled(newDate)) {
    //   setError(true);
    // } else {
    //   setError(false);
    // }
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
              onChange={handleDateChange}
              required
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>New Time</Form.Label>
            <Form.Control
              type="time"
              name="scheduledTime"
              value={formData.scheduledTime}
              // onChange={handleChange}
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
