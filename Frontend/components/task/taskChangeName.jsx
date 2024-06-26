
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import propTypes from 'prop-types';

// Context Imports
import { ReloadContext } from "../../context/contexts"
import { useContext } from 'react';

import { toast } from 'react-toastify';

import { Edit, Cancel, Confirm } from "../../assets/icons.jsx"

const TaskChangeName = ({task}) => {

    TaskChangeName.propTypes = {
        task: propTypes.object,
    };

    // context
    const { reload, setReload } = useContext(ReloadContext);

    const [changeName, setChangeName] = useState(false)
    const { register, handleSubmit } = useForm();

    const onSubmit = data => {
        // console.log(data)

        if(data.task_name === '') {
            toast.warning('Task name is empty');
            return
        }
        if (data.task_name.length > 20) {
            toast.warning('Task name is too long');
            return
        }
        if (data.task_name.length < 3) {
            toast.warning('Task name is too short');
            return
        }
        if (task.task_name === null) {
            toast.warning('Task name is null');
            return
        }
        if(data.task_name === task.task_name) {
            toast.warning('Task name is the same as the current task name');
            return
        }

        const accessToken = sessionStorage.getItem('accessToken');
      
        //Redirect to login if there's no access token
        if (!accessToken) {
            window.location.href = "http://localhost:5173/login"
            return;
        }
        fetch(`http://localhost:8000/tasks/${task.task_id}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `JWT ${accessToken}`, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task_name: data.task_name,
            })
        })
        .then(res => res.json())
        .then(() => {
            toast.success('Task name has been changed successfully!');
            setChangeName(false)
            setReload(!reload)
        })

    }

    return (
        <>
        {!changeName ?
        <div onClick={() => setChangeName(true)} className='font-medium group flex flex-row justify-between text-sm px-2 rounded-md hover:font-semibold cursor-pointer hover:bg-neutral-200 p-1'>
            Change Name
            <div className='hidden group-hover:block'>
                <Edit />
            </div>
        </div>
        :
        (
        <div className='relative flex flex-col bg-neutral-200 rounded-md'>
            <div className='font-medium text-sm px-2    p-1'>Change Name</div>
            <div onClick={() => setChangeName(false)} className='absolute right-1 top-1 font-medium hover:scale-110 cursor-pointer '><Cancel /></div>
            <div className='px-2 pb-2 w-full'>
                <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" {...register("task_name", {})} className='w-full p-1 rounded-md bg-inherit outline-none' placeholder={task.task_name} />
                
                <button type='submit' className=' w-full flex flex-row justify-center bg-green-400 rounded-md font-normal hover:scale-[101%] text-sm'>Confirm <Confirm /></button>
                </form>
            </div>
        </div>
        )
        }
        </>
    )
}

export default TaskChangeName;