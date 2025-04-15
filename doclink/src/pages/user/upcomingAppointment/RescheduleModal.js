// RescheduleModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RescheduleModal = ({ show, handleClose, appointment, onReschedule }) => {
  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
  });
  const [doctorAvailability, setDoctorAvailability] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14); // Allow selection up to 2 weeks ahead
  const maxDateFormatted = maxDate.toISOString().split("T")[0];
  useEffect(() => {
    if (appointment) {
      setFormData({
        scheduledDate: appointment.scheduledDate?.slice(0, 10),
        scheduledTime: appointment.scheduledTime || "",
      });
      setDoctorAvailability(appointment.doctorId.availabilitySchedule);
    }
  }, [appointment]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  const isDateDisabled = (date) => {
    if (!doctorAvailability) return true;
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

    if (doctorAvailability[dayName]?.available) {
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
      setAvailableSlots([]);
    } else {
      setError(false);
    }
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
              min={today}
              max={maxDateFormatted}
            />
            {error && (
              <Form.Text className="text-danger">
                Selected date is not available for rescheduling.
              </Form.Text>
            )}
          </Form.Group>
          {/* <Form.Group className="mt-3">
            <Form.Label>New Time</Form.Label>
            <Form.Control
              type="time"
              name="scheduledTime"
              value={formData.scheduledTime}
              // onChange={handleChange}
              required
            />
          </Form.Group> */}

          {availableSlots.length > 0 ? (
            <div style={{ marginTop: "20px" }}>
              <p>Available Slots:</p>
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
                      setFormData({ ...formData, scheduledTime: slot })
                    }
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div style={{ textAlign: "center" }}>
            <Button
              className="mt-4"
              type="submit"
              variant="primary"
              block
              disabled={error}
            >
              Confirm Reschedule
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RescheduleModal;
