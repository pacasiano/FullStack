import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
//import { useState } from "react"
import PropTypes from 'prop-types';

export default function Topbar({setTitle, search}) {

    //const [searchData, setSearchData] = useState([])

    Topbar.propTypes = {
        setTitle: PropTypes.string.isRequired,
        search: PropTypes.bool,
    };

    return (
        <div className="flex flex-row gap-5 justify-start items-center w-full h-14 border-b shadow-md px-5">
            <div className="flex flex-row justify-between items-center w-full ">
                <div className=" font-bold text-xl">
                    {setTitle}
                </div>
                <div className="flex flex-row gap-5 justify-between items-center">
                    {search===true && (
                    <div className={` ${search===false && "hidden"} group flex flex-nowrap relative border-b-2 border-black/20 hover:-translate-y-[1px] focus-within:border-black/50 transition-transform duration-300`}>
                        <button>
                            <FontAwesomeIcon className="pr-1 text-black/20 group-focus-within:text-black/50" icon={faMagnifyingGlass} />
                        </button>
                        <input type="search" className="bg-inherit outline-none pointer-events-auto" placeholder="Search..." />
                    </div>)}
                    <div>
                        <FontAwesomeIcon className="w-10 h-7 pt-1" icon={faUserCircle} />
                    </div>
                </div>
            </div>
        </div>
    )
}