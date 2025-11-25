import { NavLink } from "react-router-dom";

const Navbar = () => {
  const activeStyle = "text-secondary border-secondary";
  return (
    <header
      className="animate-fadeInRight mt-7 sm:mt-12
             flex flex-col sm:flex-row items-center justify-center gap-4  [&>*]:cursor-pointer
             [&>*]:border-y-2 [&>*]:transition-colors [&>*]:duration-500 
             [&>*]:text-xl sm:[&>*]:text-xl lg:[&>*]:text-2xl font-[changa-one]
             [&>*:hover]:text-secondary [&>*:hover]:border-secondary"
    >
      <NavLink
        to="/Home"
        className={({ isActive }) => `${isActive ? activeStyle : "text-white"}`}
      >
        Home
      </NavLink>
      <NavLink
        to="/MyAppointments"
        className={({ isActive }) => `${isActive ? activeStyle : "text-white"}`}
      >
        APPOINTMENTS
      </NavLink>
      <NavLink
        to="/AboutMe"
        className={({ isActive }) => `${isActive ? activeStyle : "text-white"}`}
      >
        ABOUT ME
      </NavLink>
      <NavLink
        to="/Account"
        className={({ isActive }) => `${isActive ? activeStyle : "text-white"}`}
      >
        MY ACCOUNT
      </NavLink>
    </header>
  );
};

export default Navbar;
