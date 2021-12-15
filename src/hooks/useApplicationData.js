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

  function updateSpots(id, increase = true) {
    for (const day of state.days) {
      if (day.id === id) {
        if (!increase) {
          return { ...day, spots: day.spots - 1 };
        }
        return { ...day, spots: day.spots + 1 };
      }
    }
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
        const updateDays = [];
        for (const day of state.days) {
          if (day.id === id) {
            updateDays.push(updateSpots(id, false));
          } else {
            updateDays.push(day);
          }
        }
        setState((prev) => ({ ...prev, appointments, days: updateDays }));
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

      const updateDays = [];
      for (const day of state.days) {
        if (day.id === id) {
          updateDays.push(updateSpots(id));
        } else {
          updateDays.push(day);
        }
      }
      setState((prev) => ({ ...prev, appointments, days: updateDays }));
    });
  }
  return { state, setDay, bookInterview, cancelInterview };
}
