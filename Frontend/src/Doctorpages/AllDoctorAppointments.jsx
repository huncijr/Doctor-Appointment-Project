import Navbar from "../Components/Navbar";
import { useAuth } from "../Context/CheckAuth";
import { useEffect, useState } from "react";
import { Pagination, Badge } from "flowbite-react";
import { API } from "../Context/AppointmentAPI";
import { Check, X, BadgeCheck, Timer, User, CalendarRange } from "lucide-react";
const DoctorAppointments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [upcomingappointments, setUpcomingAppointments] = useState(null);
  const [completedappointments, setCompletedAppointments] = useState(null);
  const [otherappointments, setOtherAppointments] = useState(null);
  const onPageChange = (page) => setCurrentPage(page);
  const { user } = useAuth();
  useEffect(() => {
    const FetchAppointments = async () => {
      try {
        const response = await API.get("/Doctor/Appointments", {
          withCredentials: true,
        });
        setUpcomingAppointments(response.data.findappointments);
      } catch (error) {
        console.error(error);
      }
    };
    FetchAppointments();
  }, []);
  useEffect(() => {
    console.log(upcomingappointments);
  }, [upcomingappointments]);

  const handleDay = (date) => {
    const newdate = new Date(date);
    const dayName = newdate.toLocaleDateString("en-US", { weekday: "long" });
    return dayName;
  };

  return (
    <div className="relative flex flex-col z-10 ">
      <Navbar />;
      <div className="flex self-start p-5 ">
        <span className="text-white anton-regular tracking-wide text-xl md:text-2xl lg:text-3xl xl:text-4xl">
          What are we doing today, {user.fullname} ?
        </span>
      </div>
      <div className="flex flex-col  justify-start p-5">
        <div className="flex items-center flex-col justify-center sm:items-start sm:justify-start py-10">
          <span className="text-white tracking-widest changa-one text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold hover-doubleline">
            Upcoming
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-10">
            {upcomingappointments && upcomingappointments.length > 0 ? (
              upcomingappointments.map((app) => (
                <div
                  key={app._id}
                  className="relative border-2 bg-white rounded-lg shadow-xl flex flex-col justify-between h-[400px] p-3"
                >
                  {/* Gombok */}
                  <div className="flex absolute right-2 top-2 gap-2">
                    <button className="rounded-full bg-red-700 p-3 hover:bg-red-500">
                      <X className="text-white" />
                    </button>
                    <button className="rounded-full bg-green-700 p-3 hover:bg-green-500">
                      <Check className="text-white" />
                    </button>
                  </div>

                  {/* Fő tartalom */}
                  <div className="flex flex-col gap-2">
                    <span className="lora font-bold tracking-wider">
                      {app.fullname}
                    </span>
                    <span className="font-bold lora">{app.date}</span>
                    <hr className="w-full border-2 border-black" />
                    <div className="flex w-full py-2">
                      <div className="flex-[.6] text-start min-w-0 break-words">
                        <span className="text-sm font-semibold">
                          {app.message}
                        </span>
                        <span className="flex">
                          <User /> - {app.age} years old
                        </span>
                      </div>

                      <div className="flex-[.4] ">
                        <div className="flex flex-col gap-1">
                          <Badge
                            size="sm"
                            className="cursor-pointer truncate"
                            icon={BadgeCheck}
                          >
                            {app.reason}
                          </Badge>
                          <Badge color="gray" size="sm" icon={Timer}>
                            {app.time}
                          </Badge>
                          <Badge color="indigo" size="sm" icon={CalendarRange}>
                            {handleDay(app.date)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vonal + szöveg mindig alul */}
                  <div className="mt-2">
                    <hr className="w-full border-2 border-red-600 mb-2" />
                    <span className="font-bold text-start">{`Associated with ${app.doctorname}`}</span>
                  </div>
                </div>
              ))
            ) : (
              <div>No appointments found</div>
            )}
          </div>
        </div>
        <div className="flex justify-center text-center sm:items-start sm:justify-start">
          <span className="text-white  tracking-widest  changa-one text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold hover-doubleline">
            {" "}
            Other Appointments
          </span>
        </div>
        <div className="flex flex-col items-center overflow-x-auto ">
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
