import Topbar from '../components/general/topbar'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // a plugin!
import { useState, useEffect } from 'react';
import Label from '../components/general/label';
import { useParams, useNavigate } from 'react-router-dom';

export default function MyCalendar(){

  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([])
  const [subtasks, setSubtasks] = useState([])
  const [labels, setLabels] = useState([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        console.log(accessToken)
  
        //Redirect to login if there's no access token
        if (!accessToken) {
            window.location.href = "http://localhost:5173/login"
          return;
        }
  
        const response = await fetch(`http://localhost:8000/tasks/`, {
            headers: {
                'Authorization': `JWT ${accessToken}`, 
            },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching tasks inside try block: ${response.status}`);
        }
  
        const data = await response.json();
        // get all tasks where project_id = id
        let task = data.filter(u => u.project_id === parseInt(id))
        setTasks(task)
      } catch (error) {
        console.error('Error fetching tasks in catch block: ', error);
      }
    };
  
    fetchTasks();
  }, [id]);

  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        console.log(accessToken)
  
        //Redirect to login if there's no access token
        if (!accessToken) {
            window.location.href = "http://localhost:5173/login"
          return;
        }
  
        const response = await fetch(`http://localhost:8000/subtasks/`, {
            headers: {
                'Authorization': `JWT ${accessToken}`, 
            },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching subtasks inside try block: ${response.status}`);
        }
  
        const data = await response.json();
        // get all subtasks where data.task_id = tasks.task_id
        let subtask = data.filter(sub => tasks.some(task => task.task_id === sub.task_id))
        setSubtasks(subtask)
      } catch (error) {
        console.error('Error fetching subtasks in catch block: ', error);
      }
    };
  
    fetchSubtasks();
  }, [tasks]);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        console.log(accessToken)
  
        //Redirect to login if there's no access token
        if (!accessToken) {
            window.location.href = "http://localhost:5173/login"
          return;
        }
  
        const response = await fetch(`http://localhost:8000/labels/`, {
            headers: {
                'Authorization': `JWT ${accessToken}`, 
            },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching labels inside try block: ${response.status}`);
        }
  
        const data = await response.json();
        // get all labels where data.subtask_id = subtasks.subtask_id
        let label = data.filter(label => subtasks.some(subtask => subtask.subtask_id === label.subtask_id))
        setLabels(label)
      } catch (error) {
        console.error('Error fetching labels in catch block: ', error);
      }
    };
  
    fetchLabels();
  }, [subtasks]);

  const myEventsList = subtasks.map((subtask) => {
    const label = labels.filter((label) => label.subtask_id === subtask.subtask_id);
    const filteredTasks = tasks.filter((task) => task.task_id === subtask.task_id).map((task) => task.task_id)
    // just get the first task_id
    const task_id = filteredTasks[0]

    return {
      // task_id based on is tasks.task_id is equal to subtask.task_id, dont turn into an array
      task_id: task_id,
      id: subtask.subtask_id,
      title: subtask.subtask_name,
      start: subtask.start_date,
      end: subtask.end_date,
      desc: subtask.description,
      states: label.map((tag) => ({word: tag.label_name, color: tag.color})),
      // color based on task 
      color: tasks.filter((task) => task.task_id === subtask.task_id).map((task) => task.color)
    }
  }
  )

  const goToProject = ({task_id, subtask_id}) => {
    // console.log(JSON.stringify(task_id) + " " + subtask_id)
    navigate(`/project/${id}/tasks/${task_id}/subtask/${subtask_id}`)
  }

  // const handleDateSelect = (info) => {
  //   setAddSubtask({show: true, data: {start: info.startStr, end: moment(info.endStr).subtract(1, 'days').format('YYYY-MM-DD')}})
  // };
  
  return (
  <div className="max-h-screen overflow-y-scroll">
  <Topbar setTitle={"Calendar"} search={false} />
  <div className="p-10">
    <div className="backdrop-blur-sm bg-[#fbf9f7] p-5 rounded-xl">

      <FullCalendar
        plugins={[ dayGridPlugin, interactionPlugin ]}
        // select={(info) => handleDateSelect(info)}
        eventClick={(info) => goToProject({ task_id: info.event.extendedProps.task_id, subtask_id: info.event.id })}
        events={myEventsList}
        eventContent={(eventInfo) => {
          return (
            <div className="pt-1 px-1">
              <div className="flex flex-wrap gap-1">
              {eventInfo.event.extendedProps.states.map((tag, index) => (
                <Label key={index} word={tag.word} color={tag.color} type={"1"} />
              ))}
              </div>
              <b>{eventInfo.event.title}</b>
              <p className="text-wrap text-xs font-light pb-1">{eventInfo.event.extendedProps.desc}</p>
            </div>
          );
        }}
        height={570}
        editable={true}
        selectable={true}
        initialView="dayGridMonth"
      />
        
    </div>
  </div>
  </div>
)
}
