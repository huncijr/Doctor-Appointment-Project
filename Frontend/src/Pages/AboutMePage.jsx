import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar.jsx";
import Stars from "../Components/Stars.jsx";
import axios from "axios";
import { Github } from "lucide-react";
const AboutMePage = () => {
  const username = "huncijr";
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function getUser(name) {
      try {
        const res = await axios.get(`https://api.github.com/users/${name}`);
        console.log(res.data);
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    getUser(username);
  }, []);
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="relative flex flex-col items-center z-10">
      <Navbar />
      <div className="py-10 flex flex-col items-center p-[10%] ">
        {user && (
          <div className="min-w-[80vw] border-2 min-h-[30vh] border-animated grid grid-cols-3 shadow-lg  ">
            <div className="h-[30%] ">
              <img
                src=""
                alt="welcome picture "
                className="object-contain w-full h-full border-b-2 border-red-700"
              />
            </div>
            <div className="h-[40%] flex text-white flex-col md:flex-row">
              <span className="relative left-2 top-2 font-bold animate-text-blur tracking-wide">
                {user.login}
              </span>
              <div className="flex flex-[.6] flex-col md:flex-row items-center gap-4">
                <img
                  className="border-2 rounded-full h-[30%] mt-5"
                  src={user.avatar_url}
                  alt="Github pic"
                />

                <div className="flex justify-evenly anton-regular gap-3  ">
                  <div className="flex-col">
                    <span>Following</span>
                    <span className="flex justify-center">
                      {user.following}
                    </span>
                  </div>
                  <div className="flex-col">
                    <span>Followers</span>
                    <span className="justify-center flex">
                      {user.followers}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-nowrap">Public Repos</span>
                    <span className="justify-center flex">
                      {user.public_repos}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span className="lora flex px-3 text-center md:items-end">
                  {user.bio}
                </span>
              </div>
            </div>
            <div className="h-[30%]">aaa</div>
          </div>
        )}
        <div className="mt-3 text-white hover:text-secondary hover:cursor-pointer">
          <a href="https://github.com/huncijr" target="_blank">
            <Github />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;
