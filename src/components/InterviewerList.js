import React from "react";
import InterviewerListItem from "./InterviewerListItem ";
import "./InterviewList.scss"

export default function InterviewerList(props){
  const dataArray = props.interviewers.map((interviewer)=> 
  (
    <InterviewerListItem 
        key={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={interviewer.id === props.interviewer}
        setInterviewer={()=>props.setInterviewer(interviewer.id)}
        />)
        )
  
  return (
    <section className="interviewers">
  <h4 className="interviewers__header text--light">Interviewer</h4>
  <ul className="interviewers__list">{dataArray}</ul>
</section>
  );
}