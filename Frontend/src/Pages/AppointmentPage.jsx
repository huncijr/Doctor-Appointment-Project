import NavBar from "../Components/Navbar.jsx";
import { useDoctor } from "../Context/DoctorContext.jsx";
import { use, useEffect, useState } from "react";
import { Button, Badge } from "flowbite-react";
import AppointmentTable from "../Components/Table.jsx";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../Context/AppointmentAPI.js";
import { useAuth } from "../Context/CheckAuth.jsx";
import {
  CalendarRange,
  BookmarkCheck,
  Clock3,
  MessageSquareMore,
  CircleX,
  CircleOff,
  CircleAlert,
} from "lucide-react";
const AppointmentPage = () => {
  const { user } = useAuth();
  const { selecteddoctor, setSelectedDoctor } = useDoctor();
  const [myappointments, setMyAppointments] = useState(false);
  const [appointments, setAppointments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isopen, setOpen] = useState(false);
  const Navigate = useNavigate();
  const doctorsArray = Array.isArray(selecteddoctor)
    ? selecteddoctor
    : [selecteddoctor];

  const handleNavigate = (doctor) => {
    setSelectedDoctor(doctor);
    Navigate(`/AddAppointment/${doctor.fullname}`);
  };
  const handleAppointments = async () => {
    setLoading(true);
    const doctorids = doctorsArray.map((doc) => doc._id);
    try {
      const response = await API.get("GetAppointment", {
        params: {
          userid: user._id,
          doctorid: JSON.stringify(doctorids),
        },
      });
      console.log(response.data.appointments);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(selecteddoctor);
  }, [selecteddoctor]);
  return (
    <div className="relative flex flex-col justify-center z-10 w-full ">
      <NavBar />
      {doctorsArray.length === 1 ? (
        <div>
          <div className=" flex justify-center py-10">
            <h1
              className="px-5  border-x-2 text-2xl md:text-3xl
             text-secondary border-secondary hover-doubleline"
            >
              APPOINTMENT
            </h1>
          </div>
          <div className="flex-col flex sm:flex-row gap-8 py-10 justify-between px-10 items-center sm:items-start">
            <div className=" flex-1 flex flex-col border-4 border-animated sm:w-2/3">
              <div className="relative overflow-hidden rounded-md h-0 pb-[100%]">
                <img
                  src={`http://localhost:5001${selecteddoctor.img}`}
                  alt={selecteddoctor.fullname}
                  className="absolute top-0 left-0 w-full h-full object-cover text-white"
                />
              </div>

              <div className="flex-1 flex flex-col justify-center p-4 bg-primary">
                <h1 className="text-white font-bold text-xl">
                  {selecteddoctor.fullname}
                </h1>
                <h2 className="text-secondary text-lg italic text-end ">
                  {selecteddoctor.occupation}
                </h2>
                <p className="text-white text-sm">
                  {selecteddoctor.description}
                </p>
              </div>

              <div className="flex flex-col items-center mt-4 gap-3 px-4 pb-4">
                <Link to={`/AddAppointment/${selecteddoctor.fullname}`}>
                  <Button className="rounded-full w-full bg-gradient-to-r from-secondary via-blue-secondary to-primary text-white hover:bg-gradient-to-br">
                    Add an appointment
                  </Button>
                </Link>
                <Button
                  color="light"
                  pill
                  className="w-full"
                  onClick={() => {
                    handleAppointments();
                    setMyAppointments(true);
                    setOpen(true);
                  }}
                >
                  VIEW MY APPOINTMENTS
                </Button>
              </div>
            </div>

            <div className="flex-2 sm:w-2/3 self-start sm:self-auto overflow-x-auto overflow-y-auto w-full max-w-full  ">
              <div className="min-w-[90%] w-max">
                <AppointmentTable doctor={selecteddoctor} />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            {user
              ? myappointments &&
                (appointments && appointments.length > 0 ? (
                  <div className="p-10 flex items-center flex-col gap-2">
                    <div className="animate-fadeInScale p-6 border rounded-2xl min-w-full shadow-md bg-white">
                      <div className="mb-4 text-center border-b-2 pb-3 font-semibold">
                        <h2 className="lora text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                          Your appointments!
                        </h2>
                      </div>

                      <table className="min-w-full border border-gray-300">
                        <thead className="bg-secondary/70">
                          <tr>
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-left">Date</th>
                            <th className="border px-4 py-2 text-left">Day</th>
                            <th className="border px-4 py-2 text-left">Time</th>
                            <th className="border px-4 py-2 text-left">
                              Reason
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {appointments.map((app) => (
                            <tr
                              key={app._id}
                              className="border-2 bg-gray-400 hover:bg-gray-300"
                            >
                              <td className="border px-4 py-2 text-primary font-bold">
                                {app.fullname}
                              </td>

                              <td className="border px-4 py-2">
                                <Badge color="gray" className="inline-flex">
                                  <CalendarRange className="inline-flex mr-2" />
                                  {app.date}
                                </Badge>
                              </td>

                              <td className="border px-4 py-2">
                                <Badge color="success" className="inline-flex">
                                  <BookmarkCheck className="inline-flex mr-2 text-gray-500" />
                                  {new Date(app.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "long",
                                    }
                                  )}
                                </Badge>
                              </td>

                              <td className="border px-4 py-2">
                                <Badge className="inline-flex ">
                                  <Clock3 className=" inline-flex mr-2 " />
                                  {app.time}
                                </Badge>
                              </td>

                              <td className="border px-4 py-2">
                                <Badge color="pink" className="inline-flex">
                                  <MessageSquareMore className="inline-flex mr-2 w-fit" />
                                  {app.reason}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 animate-fadeInBottom">
                      <Button
                        color="red"
                        onClick={() => setMyAppointments(false)}
                      >
                        <CircleX className="flex mr-2" /> Close
                      </Button>
                    </div>
                  </div>
                ) : (
                  !loading && (
                    <div className="px-[10%] animate-fadeInBottom">
                      <div className="flex flex-col border-2 rounded-xl shadow-md border-secondary/70 min-h-[10vh] bg-black/30 justify-center">
                        <div className="flex flex-1">
                          <div className="flex flex-[.4] justify-center items-center border-r-2 border-gray-400">
                            <CircleOff className="text-red-900" size={100} />
                          </div>
                          <div className="flex flex-[.6] justify-center items-center">
                            <span className="font-bold text-secondary text-xl text-end p-10">
                              You currently dont have appointment from{" "}
                              {selecteddoctor.fullname}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center mt-3 animate-fadeInBottom">
                        <Button
                          color="red"
                          onClick={() => setMyAppointments(false)}
                        >
                          <CircleX className="flex mr-2" /> Close
                        </Button>
                      </div>
                    </div>
                  )
                ))
              : isopen && (
                  <div className="text-white flex items-center justify-center inset-0 fixed z-50 backdrop-blur-sm bg-black/30">
                    <div className="flex flex-col sm:flex-row bg-primary rounded-xl shadow-xl p-6 w-[75%] h-[35%] overflow-hidden ">
                      <div className="flex flex-[0.4] items-center justify-center mb-3 sm:mb-auto overflow-hidden ">
                        <CircleAlert className="w-full h-full sm:w-[60%] sm:h-[60%] object-contain " />
                      </div>
                      <div className="flex flex-[0.6] flex-col justify-between">
                        <span className="text-center font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl ">
                          {" "}
                          You don't have an account
                        </span>
                        <div className="flex justify-evenly mt-3">
                          <Link to={"/Account"}>
                            <Button
                              className="font-bold text-sm sm:text-lg md:text-xl lg:text-2xl"
                              color="dark"
                              outline
                            >
                              {" "}
                              Register/Login
                            </Button>
                          </Link>
                          <Button
                            className="font-bold text-sm sm:text-lg md:text-xl lg:text-2xl"
                            color="red"
                            outline
                            onClick={() => setOpen(false)}
                          >
                            {" "}
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
          </div>
        </div>
      ) : (
        <div>
          <div className=" flex justify-center py-10">
            <h1
              className="px-5  border-x-2 text-2xl md:text-3xl
             text-secondary border-secondary"
            >
              APPOINTMENT
            </h1>
          </div>
          <div className="flex-col flex sm:flex-row gap-8 py-10 justify-between px-10 items-center sm:items-start">
            <div className="flex flex-col gap-6 sm:w-1/3 ">
              {doctorsArray.map((doctor, i) => (
                <div
                  className=" flex flex-col border-4 border-animated "
                  key={i}
                >
                  <div className="relative overflow-hidden rounded-md h-0 pb-[100%]">
                    <img
                      src={`http://localhost:5001${doctor.img}`}
                      alt={doctor.fullname}
                      className="absolute top-0 left-0 w-full h-full object-cover text-white"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-center p-4 bg-primary">
                    <h1 className="text-white font-bold text-xl">
                      {doctor.fullname}
                    </h1>
                    <h2 className="text-secondary text-lg italic text-end ">
                      {doctor.occupation}
                    </h2>
                    <p className="text-white text-sm">{doctor.description}</p>
                  </div>

                  <div className="flex flex-col items-center mt-4 gap-3 px-4 pb-4">
                    <Button
                      onClick={() => handleNavigate(doctor)}
                      className="rounded-full w-full bg-gradient-to-r from-secondary via-blue-secondary to-primary text-white hover:bg-gradient-to-br"
                    >
                      Add an appointment
                    </Button>
                    <Button
                      color="light"
                      pill
                      className="w-full"
                      onClick={() => {
                        handleAppointments();
                        setMyAppointments(true);
                        setOpen(true);
                      }}
                    >
                      VIEW MY APPOINTMENTS
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-2  sm:w-2/3 self-start sm:self-auto overflow-x-auto overflow-y-auto w-full max-w-full min-w-0">
              <div className="min-w-[30%]">
                <AppointmentTable doctor={selecteddoctor} />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            {user
              ? myappointments &&
                (appointments && appointments.length > 0 ? (
                  <div className="p-10 flex items-center flex-col gap-2">
                    <div className="animate-fadeInScale p-6 border rounded-2xl min-w-full shadow-md bg-white">
                      <div className="mb-4 text-center border-b-2 pb-3 font-semibold">
                        <h2 className="lora text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                          Your appointments!
                        </h2>
                      </div>

                      <table className="min-w-full border border-gray-300">
                        <thead className="bg-secondary/70">
                          <tr>
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-left">Date</th>
                            <th className="border px-4 py-2 text-left">Day</th>
                            <th className="border px-4 py-2 text-left">Time</th>
                            <th className="border px-4 py-2 text-left">
                              Reason
                            </th>
                            <th className="border px-4 py-2 text-left">
                              Doctor
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {appointments.map((app) => (
                            <tr
                              key={app._id}
                              className="border-2 bg-gray-400 hover:bg-gray-300"
                            >
                              <td className="border px-4 py-2 text-primary font-bold">
                                {app.fullname}
                              </td>

                              <td className="border px-4 py-2">
                                <Badge
                                  color="gray"
                                  className="inline-flex w-full "
                                >
                                  <CalendarRange className="inline-flex mr-2" />
                                  {app.date}
                                </Badge>
                              </td>

                              <td className="border px-4 py-2">
                                <Badge
                                  color="success"
                                  className="inline-flex w-full "
                                >
                                  <BookmarkCheck className="inline-flex mr-2 text-gray-500" />
                                  {new Date(app.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "long",
                                    }
                                  )}
                                </Badge>
                              </td>

                              <td className="border px-4 py-2">
                                <Badge className="inline-flex w-full ">
                                  <Clock3 className=" inline-flex mr-2 " />
                                  {app.time}
                                </Badge>
                              </td>

                              <td className="border px-4 py-2">
                                <Badge
                                  color="pink"
                                  className="inline-flex w-full "
                                >
                                  <MessageSquareMore className="inline-flex mr-2 w-fit" />
                                  {app.reason}
                                </Badge>
                              </td>
                              <td className="border px-4 py-2">
                                <span className="font-bold text-white">
                                  {app.doctorname}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 animate-fadeInBottom">
                      <Button
                        color="red"
                        onClick={() => setMyAppointments(false)}
                      >
                        <CircleX className="flex mr-2" /> Close
                      </Button>
                    </div>
                  </div>
                ) : (
                  !loading && (
                    <div className="px-[10%] animate-fadeInBottom">
                      <div className="flex flex-col border-2 rounded-xl shadow-md border-secondary/70 min-h-[10vh] bg-black/30 justify-center">
                        <div className="flex flex-1">
                          <div className="flex flex-[.4] justify-center items-center border-r-2 border-gray-400">
                            <CircleOff className="text-red-900" size={100} />
                          </div>
                          <div className="flex flex-[.6] justify-center items-center">
                            <span className="font-bold text-secondary text-xl text-end p-10">
                              You currently dont have appointment from{" "}
                              {selecteddoctor.fullname}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center mt-3 animate-fadeInBottom">
                        <Button
                          color="red"
                          onClick={() => setMyAppointments(false)}
                        >
                          <CircleX className="flex mr-2" /> Close
                        </Button>
                      </div>
                    </div>
                  )
                ))
              : isopen && (
                  <div className="text-white flex items-center justify-center inset-0 fixed z-50 backdrop-blur-sm bg-black/30">
                    <div className="flex flex-col sm:flex-row bg-primary rounded-xl shadow-xl p-6 w-[75%] h-[35%] overflow-hidden ">
                      <div className="flex flex-[0.4] items-center justify-center mb-3 sm:mb-auto overflow-hidden ">
                        <CircleAlert className="w-full h-full sm:w-[60%] sm:h-[60%] object-contain " />
                      </div>
                      <div className="flex flex-[0.6] flex-col justify-between">
                        <span className="text-center font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl ">
                          {" "}
                          You don't have an account
                        </span>
                        <div className="flex justify-evenly mt-3">
                          <Link to={"/Account"}>
                            <Button
                              className="font-bold text-sm sm:text-lg md:text-xl lg:text-2xl"
                              color="dark"
                              outline
                            >
                              {" "}
                              Register/Login
                            </Button>
                          </Link>
                          <Button
                            className="font-bold text-sm sm:text-lg md:text-xl lg:text-2xl"
                            color="red"
                            outline
                            onClick={() => setOpen(false)}
                          >
                            {" "}
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
