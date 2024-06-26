import { useEffect, useState } from "react";
import Compact from '@uiw/react-color-compact';
import Tag from '../general/label';
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';

export default function NewSublabel() {

    const { subtask_id } = useParams();
    const [labelsData, setLabelsData] = useState([]);
    const [show, setShow] = useState(false);
    const colors = ['#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#1A73E8', '#FF6F00', '#4CAF50', '#9C27B0']
    const [tagName, setTagName] = useState('');
    const [hex, setHex] = useState('');
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const accessToken = sessionStorage.getItem('accessToken');
        //Redirect to login if there's no access token
        if (!accessToken) {
            window.location.href = "http://localhost:5173/login"
            return;
        }

        fetch(`http://localhost:8000/labels/`, {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${accessToken}`, 
                'Content-Type': 'application/json',
            },
        })
        .then(res => res.json())
        .then(data => {
            const filteredLabels = data.filter(label => label.subtask_id === parseInt(subtask_id));
            setLabelsData(filteredLabels);
        });
    }, [subtask_id, reload])

    const addTag = (e) => {
        e.preventDefault();
        
        if (tagName === '') {toast.warning(`Label name too short`); return;}
        if (tagName.length < 1) {toast.warning(`Label name too short`); return;}
        if (tagName.length > 20) {
            toast.warning(`Label name too long`);
            return;
        }
        if (hex === '') {toast.warning(`Color not selected`); return;}

        const accessToken = sessionStorage.getItem('accessToken');
        //Redirect to login if there's no access token
        if (!accessToken) {
            window.location.href = "http://localhost:5173/login"
            return;
        }

        fetch('http://localhost:8000/labels/', {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${accessToken}`, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subtask_id: subtask_id,
                label_name: tagName,
                color: hex,
            })
        })
        .then(res => res.json())
        .then(newLabels => {
            toast.success(`Label ${tagName} has been added`);
            setLabelsData([...labelsData, newLabels]);
            setTagName('');
            setHex('#F44E3B');
            console.log(newLabels)
        })
        .catch(err => console.error(err));
        
    }

    return (
        <div className="relative h-full">
            <div className="flex flex-wrap gap-1 py-1 ">
                {labelsData.map((tag, index) => (
                    <div key={index}>
                        <Tag tag_id={tag.label_id} word={tag.label_name} color={tag.color} type={"2"} reload={reload} setReload={setReload} />
                    </div>
                ))}
                <div onClick={()=> setShow(!show)} className="relative group select-none flex flex-row justify-center items-center gap-1 group w-16 text-2xl h-8 rounded-md bg-[#4CAF50]/80 hover:bg-[#4CAF50] hover:scale-105 hover:cursor-pointer">
                    <div className={`-mt-0.5 text-black/50 group-hover:text-black`}>
                        +
                    </div>
                </div>
            </div>
            <div className={` ${show ? "flex" : "hidden"} absolute z-50 flex-col outline focus-within:drop-shadow-2xl outline-0 group rounded-md shadow-xl p-3 bg-slate-50`}>
                <div onClick={()=> setShow(false)} className="absolute right-3 top-1 text-black/50 hover font-bold hover:scale-125 cursor-pointer">
                    x
                </div>
                <form onSubmit={addTag}>
                    <div className="">
                        <input onChange={(e)=> setTagName(e.target.value)} value={tagName} className="bg-inherit outline-none rounded-t-md w-60 h-10 pl-2" placeholder="Tag Name" />
                    </div>
                    <Compact
                    
                    colors={colors}
                    color={hex}
                    onChange={(color) => {setHex(color.hex);}}
                    style={{backgroundColor: "inherit"}}
                    />
                    <button type="submit" className="bg-blue-900/80 rounded-[4px] text-white w-full hover:bg-blue-900/90 text-sm">Add</button>
                </form>
            </div>
        </div>
    )
}