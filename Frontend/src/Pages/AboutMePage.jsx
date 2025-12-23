import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar.jsx";
import Stars from "../Components/Stars.jsx";
import axios from "axios";
import { Github } from "lucide-react";
import readmore from "../other pics/Readmore.png";
const AboutMePage = () => {
  const username = "huncijr";
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function getUser(name) {
      try {
        const res = await axios.get(`https://api.github.com/users/${name}`);
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    getUser(username);
  }, []);

  return (
    <div className="relative flex flex-col items-center z-10">
      <Navbar />
      <div className="py-10 flex flex-col items-center p-[10%] ">
        {user && (
          <div className="min-w-[80vw] border-2 min-h-[30vh] border-animated grid grid-cols-[30%_50%_20%] shadow-lg  ">
            <div className="flex items-center justify-center ">
              <div className="w-full h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] flex items-center justify-center">
                <img
                  src={readmore}
                  alt="welcome picture "
                  className="object-cover h-full w-full animate-fadeInScale"
                />
              </div>
            </div>
            <div className="h-[50%] flex text-black flex-col md:flex-row animate-fadeInBottom bg-white/70 ">
              <span className="relative underline left-2 top-2 font-bold animate-text-blur tracking-wide sm:text-lg lg:text-xl xl:text-2xl ">
                {user.login}
              </span>
              <div className="flex flex-[.6] mt-5 md:mr-3 flex-col 2xl:flex-row items-center tracking-wide gap-5 sm:text-xl lg:text-2xl">
                <img
                  className="animate-pulse border-2 rounded-full h-[50%] mt-5"
                  src={user.avatar_url}
                  alt="Github pic"
                />

                <div className="flex justify-evenly anton-regular gap-3  ">
                  <div className="flex-col">
                    <span>FOLLOWING</span>
                    <span className="flex justify-center">
                      {user.following}
                    </span>
                  </div>
                  <div className="flex-col">
                    <span>FOLLOWERS</span>
                    <span className="justify-center flex">
                      {user.followers}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-nowrap">PUBLIC REPOS</span>
                    <span className="justify-center flex">
                      {user.public_repos}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-[.4] relative border-x-2 border-black items-center p-4">
                <span className="lora text-center">{user.bio}</span>
              </div>
            </div>
            <div className="h-[30%] border-t-2 border-white animate-slide-left py-3">
              <span className="text-white bungee-inline">
                Wanna learn more about this project?
                <a
                  href="https://github.com/huncijr/Doctor-Appointment-Project"
                  className="hover:underline text-cyan-600 cursor-pointer "
                  target="_blank"
                >
                  {" "}
                  click here
                </a>
              </span>
            </div>
          </div>
        )}
        <div className="mt-3 text-white hover:text-secondary hover:cursor-pointer">
          <a href="https://github.com/huncijr" target="_blank">
            <Github className="animate-fadeInScale " />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;
