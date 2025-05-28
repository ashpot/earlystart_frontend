import React from 'react';
import logo from '../../assets/images/earlystartlogo.png';
import { IoMenu } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";

const Navbar = () => {
  const sideMenuRef = React.useRef(null);

  const openMenu = () => {
    sideMenuRef.current.style.transform = 'translateX(-16rem)';
  };

  const closeMenu = () => {
    sideMenuRef.current.style.transform = 'translateX(16rem)';
  };

  return (
    <section className="flex justify-between items-center bg-primary px-4">
      <div className="py-2">
        <a href="#home">
          <img src={logo} alt="EarlyStart Logo" className="" />
        </a>
      </div>

      <nav className="flex-grow flex justify-end">
        <div className="font-inter space-x-9 font-bold text-base hidden md:flex items-center">
          <a href="#home">Home</a>
          <a href="#about">About EarlyStart</a>
          <a href="#partnerships">Patnerships</a>
          <a href="#contact" className="pr-5">Contact Us</a>
        </div>
      </nav>

      <div>
        <div className="flex items-center gap-4">
          <button className="block md:hidden ml-3" onClick={openMenu}>
            <IoMenu size={32} className="w-6" />
          </button>
        </div>

        <ul
          ref={sideMenuRef}
          className="flex md:hidden flex-col font-inter font-medium text-base gap-4 py-20 px-10 fixed -right-64 top-0 bottom-0 w-52 z-50 h-screen bg-amber-50 transition duration-500 dark:bg-darkHover">

          <div className="absolute right-6 top-6" onClick={closeMenu}>
            <IoMdCloseCircle size={32} className="w-5 cursor-pointer font-extrabold" />
          </div>

          <li><a href="#home" onClick={closeMenu}>Home</a></li>
          <li><a href="#about" onClick={closeMenu}>About EarlyStart</a></li>
          <li><a href="#partnership" onClick={closeMenu}>Patnerships</a></li>
          <li><a href="#contact" onClick={closeMenu}>Contact Us</a></li>
        </ul>
      </div>
    </section>
  );
};

export default Navbar;