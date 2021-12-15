import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function useApplicationData(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = useCallback((day) => setState({ ...state, day }), [state]);
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then(
      ([
        { data: daysResponse },
        { data: appointmentsResponse },
        { data: interviewersResponse },
      ]) => {
        setState((prev) => ({
          ...prev,
          days: daysResponse,
          appointments: appointmentsResponse,
          interviewers: interviewersResponse,
        }));
        console.log(daysResponse, appointmentsResponse, interviewersResponse);
      }
    );
  }, []);

  function updateSpots(state, appointments) {
    const days = state.days.map((day) => {
      if (day.name === state.day) {
        day.spots = day.appointments.filter(
          (appointmentId) => appointments[appointmentId].interview === null
        ).length;
      }
      return day;
    });
    return days;
  }

  function bookInterview(id, interview) {
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview },
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };

        const days = updateSpots(state, appointments);

        setState((prev) => ({ ...prev, appointments, days: days }));
      });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      const appointment = {
        ...state.appointments[id],
        interview: null,
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      const days = updateSpots(state, appointments);
      setState((prev) => ({ ...prev, appointments, days: days }));
    });
  }
  return { state, setDay, bookInterview, cancelInterview };
}
