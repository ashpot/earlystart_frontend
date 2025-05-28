import React from 'react'
import { FaHome } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { FaAward } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import ESlogo from '../../assets/images/eslogowhite.png'

function CollapsedSidebar() {
  return (
    <div className='font-inter bg-primary text-secondaryDark w-20' >
        <div className="flex items-center justify-center border-b py-[12.7px] cursor-pointer">
          <img src={ESlogo} />
        </div>
     
        <nav className='mt-11'>
          <ul className='space-y-7 '>
            <li className='font-bold text-xl flex justify-center p-1 hover:bg-white hover:py-1'> <FaHome /> </li>
    
            <li className='font-bold text-xl flex justify-center p-1 hover:bg-white hover:py-1'> <FaUser /> </li>

            <li className='font-bold text-xl flex justify-center p-1 hover:bg-white hover:py-1'> <FaPenToSquare /> </li>

            <li className='font-bold text-xl flex justify-center p-1 hover:bg-white hover:py-1'> <FaVideo /> </li>

            <li className='font-bold text-xl flex justify-center p-1 hover:bg-white hover:py-1'> <FaAward /> </li>

            <li className='font-bold text-xl flex justify-center p-1 hover:bg-white hover:py-1'> <FaShoppingCart /> </li>

            <li className='font-bold text-xl flex justify-center p-1 hover:bg-white hover:py-1'> <IoMdSettings /> </li>

          </ul>
        </nav>
        
      </div>
  )
}

export default CollapsedSidebar;
