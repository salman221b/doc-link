// RescheduleModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../newAppointment/Appointment.css";

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
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [doctorAvailability, setDoctorAvailability] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (appointment) {
      setFormData({
        scheduledDate: appointment.scheduledDate?.slice(0, 10),
        scheduledTime: appointment.scheduledTime || "",
      });
    }
    try {
      const doctorId = appointment.doctorId;
      if (doctorId) {
        fetch(
          `https://doc-link-backend.onrender.com/doctorAvailability/${doctorId}`
        )
          .then((response) => response.json())
          .then((data) => {
            setSelectedDoctor(data);
          })
          .catch((error) => {
            console.error("Error fetching doctor availability:", error);
          });
      }
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
    }
  }, [appointment]);

  useEffect(() => {
    if (selectedDoctor) {
      setDoctorAvailability(selectedDoctor.availabilitySchedule || {});
    } else {
      setDoctorAvailability({});
    }
  }, [selectedDoctor]);
  const isDateDisabled = (date) => {
    if (!selectedDoctor || !doctorAvailability) return true;
    const dayName = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return !doctorAvailability[dayName]?.available;
  };
  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setFormData((prev) => ({ ...prev, scheduledDate: newDate }));
    const dayName = new Date(newDate)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    console.log("Selected Day:", dayName);

    if (selectedDoctor && doctorAvailability[dayName]?.available) {
      let startTime = doctorAvailability[dayName].startTime; // e.g., "09:00"
      let endTime = doctorAvailability[dayName].endTime; // e.g., "17:00"

      if (startTime && endTime) {
        let slots = [];
        let [startHour, startMinute] = startTime.split(":").map(Number);
        let [endHour, endMinute] = endTime.split(":").map(Number);

        let startMinutes = startHour * 60 + startMinute;
        let endMinutes = endHour * 60 + endMinute;

        for (let i = startMinutes; i < endMinutes; i += 30) {
          let hours = Math.floor(i / 60);
          let minutes = i % 60;
          let formattedTime = `${String(hours).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}`;
          if (formattedTime !== "13:00" && formattedTime !== "13:30") {
            slots.push(formattedTime);
          }
        }

        console.log("Available Slots:", slots);
        setAvailableSlots(slots);
      }
    }

    if (isDateDisabled(newDate)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   };

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
              min={today}
              max={maxDateFormatted}
              error={error}
              helperText={error ? "Doctor is not available on this day." : ""}
            />
          </Form.Group>
          {availableSlots.length > 0 ? (
            <div>
              <p className="text">Available Slots:</p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {availableSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={`slot-button ${
                      formData.scheduledTime === slot ? "selected" : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, scheduledTime: slot }))
                    }
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <Button className="mt-4" type="submit" variant="primary" block>
            Confirm Reschedule
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RescheduleModal;
