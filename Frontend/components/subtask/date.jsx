
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useForm } from 'react-hook-form';

export default function Date() {

    const { subtask_id } = useParams();
    const [edit, setEdit] = useState(false);
    const [date, setDate] = useState({
        from: "",
        to: ""
    });
    const { register, handleSubmit, formState: { errors } } = useForm();
    

    useEffect(() => {
        fetch(`http://localhost:8000/api/subtasks/${subtask_id}/`)
        .then(res => res.json())
        .then(data => {
            setDate({
                from: moment(data.start_date).format('YYYY-MM-DDTHH:mm'),
                to: moment(data.end_date).format('YYYY-MM-DDTHH:mm')
            });
        });

    }, [subtask_id]);

    const onSubmit = (data) => {

        console.log(errors)
        if (data.start_date === "" || data.end_date === "")return;
        if (moment(data.end_date).isBefore(data.start_date)) {
            console.log("Error, end_date entered is before start_date")
            return;
        }

        fetch(`http://localhost:8000/api/subtasks/${subtask_id}/`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                start_date: data.start_date,
                end_date: data.end_date
            })
        })
        .then(res => res.json())
        .then(data => {
            setDate({
                from: moment(data.start_date).format('YYYY-MM-DDTHH:mm'),
                to: moment(data.end_date).format('YYYY-MM-DDTHH:mm')
            });
            setEdit(false);
        });

    }


    return (
        <div className='flex flex-col gap-2'>
            <div className="flex flex-row justify-between gap-2">
                <h1 className="text-lg font-semibold">Date</h1>
                <section onClick={()=> setEdit(!edit)} className="flex items-center select-none justify-center text-center rounded-md bg-neutral-200 h-7 px-2 cursor-pointer hover:bg-neutral-400 group">
                    <div className='group-hover:text-white text-black/50 font-light text-sm'>{!edit ? "Edit" : "Cancel"}</div>
                </section>
            </div>
            {!edit ? (
            <div className="flex flex-col gap-2">
                <div className="relative ">
                    <div className='absolute -top-3 left-3 bg-[#fbf9f7] translate-y-[11px] h-1'><div className='-translate-y-[9px] text-sm'>from</div></div>
                    <input type='datetime-local' value={date.from} disabled={true} className='w-full h-9 rounded-sm bg-inherit outline-none border border-black/30 px-1' />
                </div>
                <div className="relative ">
                    <div className='absolute -top-3 left-3 bg-[#fbf9f7] translate-y-[11px] h-1'><div className='-translate-y-[9px] text-sm'>to</div></div>
                    <input type='datetime-local' value={date.to} disabled={true} className='w-full h-9 pl-2 rounded-sm bg-inherit outline-none border border-black/30 px-1' />
                </div>
            </div>
            ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <div className="relative ">
                        <div className='absolute z-50 -top-3 left-3 bg-[#fbf9f7] translate-y-[9px] h-1'><div className='-translate-y-[7px] text-sm'>from</div></div>
                        <input  type="datetime-local" placeholder="start_date" {...register("start_date", {})} className='w-full h-9 rounded-sm bg-neutral-200 outline-none border border-black px-1' />
                    </div>
                    <div className="relative ">
                        <div className='absolute z-50 -top-3 left-3 bg-[#fbf9f7] translate-y-[9px] h-1'><div className='-translate-y-[7px] text-sm'>to</div></div>
                        <input  type="datetime-local" placeholder="end_date" {...register("end_date", {})} className='w-full h-9 pl-2 rounded-sm bg-neutral-200 outline-none border border-black px-1' />
                    </div>
                    <input type='submit' className='w-full h-9 rounded-sm text-black/50 hover:text-black bg-green-500 hover:bg-green-300 cursor-pointer' />
                </div>
            </form>
            )}
        </div>
    )
}