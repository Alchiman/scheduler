export function getAppointmentsForDay(state, day) {
  const filteredDays = state.days.filter((object) => object.name === day);
  if (filteredDays.length === 0) {
    return [];
  }
  const appointmentIds = filteredDays[0].appointments;

  const appointments = [];
  for (const id of appointmentIds) {
    appointments.push(state.appointments[id]);
  }
  return appointments;
}
