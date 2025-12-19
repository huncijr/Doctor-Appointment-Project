import Navbar from "../Components/Navbar";
import { useAuth } from "../Context/CheckAuth";
import { useEffect, useState } from "react";
import { Pagination } from "flowbite-react";
import { API } from "../Context/AppointmentAPI";
import AppointmentCard from "../Components/AppointmentCards";
import { LaptopMinimalCheck } from "lucide-react";
const DoctorAppointments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [upcomingappointments, setUpcomingAppointments] = useState([]);
  const [completedappointments, setCompletedAppointments] = useState([]);
  const [otherappointments, setOtherAppointments] = useState([]);

  const onPageChange = (page) => setCurrentPage(page);
  const { user } = useAuth();
  useEffect(() => {
    const FetchAppointments = async () => {
      try {
        const response = await API.get("/Doctor/Appointments", {
          withCredentials: true,
        });

        const { upcoming, completed } = response.data;
        const firstupcoming = upcoming.slice(0, 5);
        const firstotherupcomig = upcoming.slice(firstupcoming.length);
        setUpcomingAppointments(firstupcoming);
        setOtherAppointments(firstotherupcomig);
        setCompletedAppointments(completed);
      } catch (error) {
        console.error(error);
      }
    };
    FetchAppointments();
  }, []);
  useEffect(() => {
    console.log(upcomingappointments);
  }, [upcomingappointments]);

  const getGreeting = (name) => {
    const hour = new Date().getHours();
    if (hour > 5 && hour << 12) return `Good morning, ${name}!`;
    if (hour > 12 && hour < 18) return `Good afternoon, ${name}!`;
    if (hour > 18 && hour < 24) return `Good evening, ${name}!`;
    return `What are we doing today, ${name}!`;
  };

  const handleDay = (date) => {
    const newdate = new Date(date);
    const dayName = newdate.toLocaleDateString("en-US", { weekday: "long" });
    return dayName;
  };
  const handleAppointments = (id) => {
    let movedAppointment = null;

    // 1. Először vegyük ki az other appointments első elemét
    setOtherAppointments((prevOthers) => {
      if (!prevOthers || prevOthers.length === 0) return prevOthers;

      [movedAppointment] = prevOthers; // Eltároljuk
      return prevOthers.slice(1); // Levesszük az elsőt
    });

    // 2. Aztán frissítsük az upcoming-ot
    setUpcomingAppointments((prevUpcoming) => {
      const filtered = prevUpcoming.filter((app) => app._id !== id);

      // Csak akkor adjuk hozzá, ha van movedAppointment ÉS még nincs benne
      if (
        movedAppointment &&
        !filtered.some((app) => app._id === movedAppointment._id)
      ) {
        return [...filtered, movedAppointment];
      }

      return filtered;
    });
  };

  const handleDelete = async (appointmentid) => {
    try {
      const res = await API.delete("/DeleteAppointment", {
        data: { appointmentid },
      });
      handleAppointments(appointmentid);
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddCompleted = async (appointmentid) => {
    console.log(appointmentid);
    try {
      const response = await API.put("/AddCompleted", { appointmentid });
      setCompletedAppointments((prev) => {
        return [...prev, response.data];
      });
      handleAppointments(appointmentid);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="relative flex flex-col z-10 ">
      <Navbar />;
      <div className="animate-fadeInScale">
        <h1 className="text-center animate-text-blur anton-regular tracking-widest py-14 flex items-center justify-center text-secondary text-7xl">
          {" "}
          Your Dashboard
        </h1>
      </div>
      <div className="flex self-center p-5 ">
        <span className="text-white anton-regular tracking-wide text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          {getGreeting(user.fullname)}
        </span>
      </div>
      <div className="flex flex-col  justify-start p-5">
        <div className="flex items-center flex-col justify-center sm:items-start sm:justify-start py-10">
          {completedappointments && completedappointments.length > 0 && (
            <>
              <span className="text-white tracking-widest changa-one text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold hover-doubleline">
                Completed
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8  gap-5 mt-10 animate-fadeInBottom mb-5 ">
                {completedappointments.length > 0 ? (
                  completedappointments.map((appointment) => (
                    <div
                      disabled
                      key={appointment._id}
                      className="relative bg-white/90 border-2 h-[400px]  p-3 opacity-50 cursor-not-allowed  overflow-y-auto "
                    >
                      <div className="py-4 flex flex-col  items-center  justify-center ">
                        <span className="font-bold text-green-700 text-xl md:text-2xl lg:text-3xl py-2">
                          SUCCESS !
                        </span>
                        <LaptopMinimalCheck
                          size={50}
                          className="h-[20%] animate-pulse rounded-full text-green-700 "
                        />
                        <div className="py-2 w-full">
                          <hr className="border-2 border-black"></hr>
                        </div>
                        <div className="flex flex-col justify-between gap-1">
                          <ul className="custom-list font-bold text-2xl">
                            <li className=" ">{appointment.fullname}</li>
                            <li className=" ">{appointment.date}</li>
                            <li className=" ">{appointment.time}</li>
                          </ul>
                        </div>
                        <div className="py-2 w-full ">
                          <hr className="border-2 border-black"></hr>
                          <div className="py-2 text-sm  text-center max-h-40 break-words overflow-y-auto ">
                            {appointment.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No completed found today</div>
                )}
              </div>
            </>
          )}
          <span className="text-white tracking-widest changa-one text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold hover-doubleline">
            Upcoming
          </span>
          <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10 animate-fadeInBottom ">
            {upcomingappointments && upcomingappointments.length > 0 ? (
              upcomingappointments.map((app) => (
                <AppointmentCard
                  key={app._id}
                  appointment={app}
                  onDelete={handleDelete}
                  onComplete={handleAddCompleted}
                  handleDay={handleDay}
                />
              ))
            ) : (
              <div className="flex relative">
                <span className="changa-one font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-secondary ">
                  No appointments found !
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center  sm:items-start sm:justify-start">
          <span className="text-white text-center tracking-widest  changa-one text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold hover-doubleline">
            {" "}
            Other Appointments
          </span>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10 animate-fadeInBottom "
            disabled
          >
            {otherappointments && otherappointments.length > 0 ? (
              otherappointments.map((app) => (
                <AppointmentCard
                  key={app._id}
                  appointment={app}
                  onDelete={handleDelete}
                  onComplete={handleAddCompleted}
                  handleDay={handleDay}
                />
              ))
            ) : (
              <div className="flex relative">
                <span className="changa-one tracking-wildest font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-secondary">
                  No appointments found !
                </span>
              </div>
            )}
          </div>
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
