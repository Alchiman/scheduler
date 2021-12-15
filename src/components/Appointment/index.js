import React, { useEffect } from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_SAVE = "ERROR_SAVE";
  const { mode, transition, back } = useVisualMode(
    !props.interview ? EMPTY : SHOW
  );

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }

    if (!props.interview && mode === SHOW) {
      transition(EMPTY);
    }
  }, [mode, transition, props.interview]);

  function save(name, interviewer) {
    if (name && interviewer) {
      transition(SAVING);

      const interview = {
        student: name,
        interviewer,
      };

      props
        .bookInterview(props.id, interview)
        .then((res) => {
          transition(SHOW);
        })
        .catch((error) => {
          console.log(error);
          transition(ERROR_SAVE, true);
        });
    }
  }

  function remove() {
    if (mode === CONFIRM) {
      transition(DELETING, true);
      props
        .cancelInterview(props.id)
        .then((res) => {
          transition(EMPTY);
        })
        .catch(() => transition(ERROR_DELETE, true));
    } else {
      transition(CONFIRM);
    }
  }
  function edit() {
    transition(EDIT);
  }
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && (
        <Empty
          onAdd={() => {
            transition(CREATE);
          }}
        />
      )}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={remove}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          onCancel={back}
          onConfirm={remove}
          message="Are you sure you would like to delete?"
        />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Could not create appointment" onClose={back} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not cancel appointment" onClose={back} />
      )}
    </article>
  );
}
