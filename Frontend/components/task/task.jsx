
import Tag from '../general/tag';
import Topbar from '../general/topbar'
import PropTypes from 'prop-types';
import { useState } from 'react';
import Compact from '@uiw/react-color-compact';
import Label from '../../data/Label';
import UserSubtask from '../../data/UserSubtask';
import User from '../../data/User';

export default function Task({data}) {

    Task.propTypes = {
        data: PropTypes.object.isRequired,
    };

    const [tagName, setTagName] = useState('');
    const [hex, setHex] = useState('#F44E3B');
    
    const colors = [
        '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#1A73E8', '#FF6F00', '#4CAF50', '#9C27B0'
    ]

    // filter the labels that are in the Subtask with the same task_id
    const labels = Label.filter((label) => label.subtask_id === data.subtask_id)
    // filter the users that are in the Subtask with the same task_id
    const userIds = UserSubtask.filter((user) => user.subtask_id === data.subtask_id)
    // get the names of the users in User data by using user_id from uesrids (only users has the data)
    const users = userIds.map((user) => User.find((u) => u.user_id === user.user_id).username)

    
    const addTag = (e) => {
        e.preventDefault();
    
        // change this to upload to the database instead
        let newTag = { label_id: data.subtask_id,  subtask_id: labels[labels.length-1].subtask_id + 1, name: tagName, color: hex}
        labels.push(newTag)

        setTagName("")
        setHex("#FFFFFF")
    }

    return (
        <div className=" min-h-screen">
            <Topbar setTitle={data.name} search={false} />

            <div className="p-8">

                {/* Tags and Add Button */}
                <div className="p-2 bg-black/5 bg-opacity-10 rounded-md flex flex-row justify-between items-center">

                    <div className="flex flex-wrap gap-2 p-2 rounded-xl">
                        {labels.map((tag, index) => (
                            <Tag key={index} word={tag.name} color={tag.color} type={"2"} />
                        ))}
                    </div>

                    <div className="px-3 text-black bg-white/50 rounded-md flex flex-row justify-center items-center gap-2" >
                        <form onSubmit={addTag}>
                        <div className="px-2 text-sm h-full flex flex-row justify-center items-center gap-1">
                            <div className="text-black/80 font-light">
                                <input onChange={(e) => setTagName(e.target.value)} value={tagName} className="outline-none bg-inherit border-b-2 border-black/20 placeholder:font-normal placeholder:text-md placeholder:text-black/40 " placeholder="tag name..." />
                            </div>
                            <div className="bg-inherit font-normal pl-3 py-1">
                                <Compact
                                className="bg-inherit"
                                colors={colors}
                                color={hex}
                                onChange={(color) => {setHex(color.hex);}}
                                />
                            </div>
                            <button type="submit" className="bg-green-900/70 text-white px-2 h-8 w-20 rounded-md font-light">
                                Add Tag
                            </button>
                        </div>
                        </form>
                    </div>

                </div>

                {/* Project Info */}
                <div className="p-3 flex flex-col gap-3">
                    <div className="">
                        <p className="text-xl font-bold">
                            Description
                        </p>
                        {data.desc}
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                        <p className="text-black/50 text-sm font-light">created:</p>
                        <p className="text-black/50 font-thin text-sm">{data.start_date}</p>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                        <p className="text-black/50 text-sm font-light">deadline:</p>
                        <p className="text-black/50 font-thin text-sm">{data.end_date}</p>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                        <p className="text-black/50 text-sm font-light">assigned:</p>
                        <p className="text-black/50 font-thin text-sm">{users.join(", ")}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}