import PropTypes from 'prop-types';
import Tag from './tag';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCaretDown, faCircleMinus } from '@fortawesome/free-solid-svg-icons'; 
//import Circle from '@uiw/react-color-circle';
import Compact from '@uiw/react-color-compact';

export default function ProjectCard({data}) {

    ProjectCard.propTypes = {
        data: PropTypes.func.isRequired,
    };

    const [add, setAdd] = useState(true)
    const [tagName, setTagName] = useState('');
    const [hex, setHex] = useState('#F44E3B');

    const showadd = () => {
        if(add===true) {setAdd(false)} else {setAdd(true)}
    }

    const [states, setStates] = useState([
        {
            word: "complete",
            color: "#10B981"
        },
        {
            word: "trashed",
            color: "#EF4444"
        },
        {
            word: "doing",
            color: "#3B82F6"
        }
    ])

    const [colors, setColors] =  useState([
       '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#1A73E8', '#FF6F00', '#4CAF50', '#9C27B0'
    ])

    const addTag = (e) => {
        e.preventDefault();
        //instaed of setStates, update the database of the changes to the users states
        setStates([...states, { word: tagName, color: hex}]);
        setTagName("")
        setHex("#FFFFFF")
        showadd()
    }

    return (
        <div className="flex flex-row gap-0">
            <div className="flex flex-col gap-2 p-5 bg-neutral-50 shadow-md rounded-md w-56">
                <div className="flex justify-between gap-1">
                    <div className="flex flex-wrap gap-1 items-center w-full">
                        {states.map((tag, index) => (
                            <Tag key={index} word={tag.word} color={tag.color} />
                        ))}
                    </div>
                    <div className="group relative w-min h-min">
                        {add ?
                        <FontAwesomeIcon onClick={showadd} className="text-xl text-black/20 group-hover:text-black/80" icon={faCirclePlus} />
                        :
                        <FontAwesomeIcon onClick={showadd} className="text-xl text-red-900/80" icon={faCircleMinus} />
                        }
                        <div  className={` hidden absolute group-hover:block -translate-y-[53px] -translate-x-2 rounded-md px-2 ${add ? "bg-black" : "bg-red-900"} `}>
                            <FontAwesomeIcon className={` absolute -z-10 size-5 translate-y-[10px] ${add ? "text-black" : "text-red-900"} `} icon={faCaretDown} />
                            <p className="z-50 text-white font-thin text-sm whitespace-nowrap ">{add ? "add tag" : "exit"}</p>
                        </div>
                    </div>
                </div>
                <div className="text-xl font-bold">
                    {data.name}
                </div>
                <p className=" overflow-wrap break-words font-light h-full">
                    {data.desc}
                </p>
            </div>
            <div className=" bg-black/10 text-black max-h-32 h-[90%] translate-y-[5%] w-64 py-2 rounded-r-md w-47" hidden={add} >
                <form className="" onSubmit={addTag}>
                <div className="px-2 text-sm h-full flex flex-col gap-1 justify-center">
                    <div className="text-black/80 font-light">
                        <input onChange={(e) => setTagName(e.target.value)} value={tagName} className="w-full -translate-y-1 text-black outline-none bg-inherit border-b-2 border-black/20 placeholder:font-normal placeholder:text-md placeholder:text-black/40 " placeholder="name..." />
                    </div>
                    <div className="text-black/40 font-normal">

                        <Compact
                        className=""
                        colors={colors}
                        color={hex}
                        onChange={(color) => {setHex(color.hex);}}
                        />

                        {/* <Circle
                        className="pt-1"
                        colors={colors}
                        color={hex}
                        onChange={(color) => {
                            setHex(color.hex);
                        }}
                        /> */}

                    </div>
                    <button type="submit" className="bg-green-900/70 text-white px-2 rounded-sm font-light">
                        submit
                    </button>
                </div>
                </form>
            </div>
        </div>
    )    
}