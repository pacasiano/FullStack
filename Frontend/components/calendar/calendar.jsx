import Topbar from '../general/topbar'
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // a plugin!
import { useState } from 'react';
import moment from 'moment';
import Tag from '../general/tag';
import Task from '../../data/Task';
import Subtask from '../../data/Subtask';
import Label from '../../data/Label';

export default function MyCalendar({projectInfo, setChosenProj, setAddProj}){

  MyCalendar.propTypes = {
    projectInfo: PropTypes.object.isRequired,
    setChosenProj: PropTypes.func.isRequired,
    setAddProj: PropTypes.func.isRequired
  };

  // get all task where project_id is 1
  const taskId = Task.filter((task) => task.project_id === projectInfo.project_id)
  // get all subtask where taak id is in taskId
  const data = Subtask.filter((subtask) => taskId.map((task) => task.task_id).includes(subtask.task_id))
  // get all labels where subtask_id is in data
  const labels = Label.filter((label) => data.map((subtask) => subtask.subtask_id).includes(label.subtask_id))

  const [myEventsList, setMyEventsList] = useState( data.map((t) => ({

    id: t.subtask_id,
    title: t.name,
    start: new Date(t.start_date),
    end: new Date(t.end_date),
    states: labels.filter((label) => label.subtask_id === t.subtask_id).map((label) => ({word: label.name, color: label.color})),
    desc: t.description,
     // color where the color is based on the task color
    color: taskId.find((task) => task.task_id === t.task_id).color

  })))

  const goToProject = (id) => {
    // find the subtask where subtask_id is equal to id
    const intId = parseInt(id, 10);
    const task = Subtask.find((subtask) => subtask.subtask_id === intId)
    setChosenProj(task)
    window.location.href = '/project/calendar';
  }

  const handleDateSelect = (info) => {
    setAddProj({show: true, data: {start: info.startStr, end: moment(info.endStr).subtract(1, 'days').format('YYYY-MM-DD')}})
  };
  
  
  return (
  <div className="max-h-screen overflow-y-scroll">
  <Topbar setTitle={"Calendar"} search={false} />
  <div className="p-7">
    <div className="bg-white/70 p-5 rounded-xl">

      <FullCalendar
        plugins={[ dayGridPlugin, interactionPlugin ]}
        select={(info) => handleDateSelect(info)}
        eventClick={(info) => goToProject(info.event.id)}
        events={myEventsList}
        eventContent={(eventInfo) => {
          return (
            <div className="p-1">
              <div className="flex flex-wrap gap-1">
              {eventInfo.event.extendedProps.states.map((tag, index) => (
                <Tag key={index} word={tag.word} color={tag.color} type={"1"} />
              ))}
              </div>
              <b>{eventInfo.event.title}</b>
              <p className="text-wrap text-xs font-light">{eventInfo.event.extendedProps.desc}</p>
            </div>
          );
        }}
        height={640}
        editable={true}
        selectable={true}
        initialView="dayGridMonth"
      />
        
    </div>
  </div>
  </div>
)
}
