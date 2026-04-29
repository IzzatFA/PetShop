import appointmentModel from '../models/appointmentModel.js';

const index = async (req, res) => {
  try {
    const appointments = await appointmentModel.getAllAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

const store = async (req, res) => {
  try {
    const { user_id, animal_id, date, note } = req.body;
    const appointment = await appointmentModel.createAppointment(user_id, animal_id, date, note);
    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment', details: error.message });
  }
};

const userAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.getAppointmentsByUserId(req.params.userId);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

export default {
  index,
  store,
  userAppointments,
};
