import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/CheckAuth";
import Man from "../other pics/menguess.webp";
import Woman from "../other pics/womenguess.webp";
import Guess from "../other pics/guest.png";
const Navbar = () => {
  let { user } = useAuth();
  const activeStyle = "text-secondary border-secondary";
  return (
    <div className="flex flex-col  mt-5">
      {user && user.gender && (
        <div className="flex justify-center items-center  sm:absolute sm:top-0 sm:right-0   ">
          <div className="flex flex-col py-3  ">
            <div className="px-3  h-[3vh] sm:h-[4vh] md:h-[5vh] lg:h-[6vh] xl:h-[7vh] ">
              <img
                src={
                  user.gender === "Men"
                    ? Man
                    : user.gender === "Women"
                    ? Woman
                    : Guess
                }
                alt="userimage.png"
                className="object-cover h-full rounded-full border-2 border-black"
              />
            </div>
            <span className="italic py-1 sm:px-5 text-white sm:text-black">
              {user && user.username}
            </span>
          </div>
        </div>
      )}
      <header
        className="animate-fadeInRight mt-7 sm:mt-12
             flex flex-col sm:flex-row items-center justify-center gap-4  [&>*]:cursor-pointer
             [&>*]:border-y-2 [&>*]:transition-colors [&>*]:duration-500 
             [&>*]:text-xl sm:[&>*]:text-xl lg:[&>*]:text-2xl font-[changa-one]
             [&>*:hover]:text-secondary [&>*:hover]:border-secondary"
      >
        <NavLink
          to="/Home"
          className={({ isActive }) =>
            `${isActive ? activeStyle : "text-white"}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/MyAppointments"
          className={({ isActive }) =>
            `${isActive ? activeStyle : "text-white"}`
          }
        >
          APPOINTMENTS
        </NavLink>
        <NavLink
          to="/AboutMe"
          className={({ isActive }) =>
            `${isActive ? activeStyle : "text-white"}`
          }
        >
          ABOUT ME
        </NavLink>
        <NavLink
          to="/Account"
          className={({ isActive }) =>
            `${isActive ? activeStyle : "text-white"}`
          }
        >
          MY ACCOUNT
        </NavLink>
        {user && user.role === "doctor" && (
          <NavLink
            to="/Doctor/MyAppointments"
            className={({ isActive }) =>
              `${isActive ? activeStyle : "text-white"}`
            }
          >
            MyAppointments!
          </NavLink>
        )}
      </header>
    </div>
  );
};

export default Navbar;
