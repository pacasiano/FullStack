
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {Edit,Cancel} from "../../assets/icons"

import { toast } from 'react-toastify';

const LastName = ({user, setUser}) => {

    LastName.propTypes = {
        user: PropTypes.object.isRequired,
        setUser: PropTypes.func.isRequired
    };

    const [edit, setEditable] = useState(false)
    const { register, handleSubmit } = useForm();

    const onSubmit = data => {

        if(data.last_name === ""){
            toast.error("Last name cannot be empty")
            return
        }
        if(data.last_name === user.last_name){
            toast.error("No changes made")
            return
        }

        const accessToken = sessionStorage.getItem('accessToken');
        //Redirect to login if there's no access token
        if (!accessToken) {
            window.location.href = "http://localhost:5173/login"
            return;
        }

        fetch(`http://localhost:8000/users/${user.user_id}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `JWT ${accessToken}`, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            setUser(data)
            toast.success("Last name successfully updated")
            setEditable(false)
        })
        
    }


    return (
        <>

        {!edit ? (
        <div className="flex flex-col gap-1 "> 
            <div className='flex flex-col'>
                <div className='flex flex-row justify-start items-center gap-1'>
                    Last name <div onClick={()=> setEditable(true)} className='hover:scale-110 cursor-pointer'><Edit input={"16px"} /></div>
                </div>
                <input disabled defaultValue={user.last_name} className="disabled min-w-52 p-2 outline-neutral-400 rounded-md bg-neutral-100" />
            </div>
        </div>
        ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1 "> 
                <div className='flex flex-col'>
                    <div className='flex flex-row justify-start items-center gap-1'>
                        Last name <div onClick={()=> setEditable(false)} className='hover:scale-110 cursor-pointer'><Cancel /></div>
                    </div>
                    <input id='input' type="text" placeholder={user.last_name} {...register("last_name", {})} className="min-w-52 p-2 outline-neutral-400 rounded-md bg-neutral-100" />
                </div>
                <button type="submit" className="bg-neutral-700/20 hover:bg-neutral-700/40 rounded-md px-2 p-1 w-1/4">Save</button>
            </div>
            </form>
        )}

        </>
    )
}

export default LastName;