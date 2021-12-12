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

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewerId = interview.interviewer;
  const interviewObject = {
    student: interview.student,
    interviewer: { ...state.interviewers[interviewerId] },
  };
  return interviewObject;
}

export function getInterviewersForDay(state, day) {
  const filteredinterviewers = state.days.filter(
    (object) => object.name === day
  );
  if (filteredinterviewers.length === 0) {
    return [];
  }
  const interviewerIds = filteredinterviewers[0].interviewers;

  const interviewers = [];
  for (const id of interviewerIds) {
    interviewers.push(state.interviewers[id]);
  }

  return interviewers;
}
