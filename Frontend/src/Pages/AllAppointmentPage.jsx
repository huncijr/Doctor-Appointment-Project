import React from "react";
import Navbar from "../Components/Navbar";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Card,
  Toast,
  ToastToggle,
  Label,
  Textarea,
  Badge,
  Rating,
  RatingStar,
} from "flowbite-react";
import StarRating from "../Components/StarRating";
import {
  ShieldX,
  Trash2,
  FileChartColumn,
  NotebookPen,
  Sticker,
  Calendar,
  Clock,
  FileUser,
  CheckCheck,
  Info,
  BookMarked,
} from "lucide-react";
import { API } from "../Context/AppointmentAPI";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../Context/CheckAuth";
import { Link } from "react-router-dom";
import axios from "axios";
import getstarted from "../other pics/getstarted.png";
import toast from "react-hot-toast";

const AllAppointmentPage = () => {
  const { user, setUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [completedappointments, setCompletedAppointments] = useState([]);
  const [alreadyappointments, setAlreadyAppointments] = useState([]);
  const [reviewappointment, setReviewAppointment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waitdelete, setWaitDelete] = useState(false);
  const [deletetimeout, setDeleteTimeout] = useState(null);
  const [isreview, setIsReview] = useState(false);
  const [selecteddoctor, setSelectedDoctor] = useState([]);
  const [reviewloading, setReviewLoading] = useState(false);
  const [userreview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);

  const CancelDelete = useRef();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await API.get("GetAppointment", {
          params: {
            userid: user._id,
          },
        });
        const already = [];
        const normal = [];
        const completed = [];
        const filterAppointments = res.data.appointments.forEach((app) => {
          if (app.completed) {
            already.push(app);
            if (!app.disabled) {
              completed.push(app);
            }
          } else if (!app.disabled) {
            normal.push(app);
          }
        });
        setAlreadyAppointments(already);
        setCompletedAppointments(completed);
        setAppointments(normal);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(error);
        }
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchAppointment();
    }
  }, [user]);
  useEffect(() => {
    console.log(alreadyappointments);
  }, [appointments, alreadyappointments]);
  useEffect(() => {
    console.log(selecteddoctor);
  }, [selecteddoctor]);

  const handleDisable = async (e, id) => {
    e.preventDefault();
    console.log(id);
    try {
      const response = await API.put("/UpdatedAppointment", {
        appointmentid: id,
      });
      console.log(response.data);
      setCompletedAppointments((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReview = (e, id) => {
    try {
      setReviewLoading(true);
      e.preventDefault();
      setTimeout(async () => {
        const res = await API.get("/ADoctor", {
          params: {
            doctorid: id,
          },
        });
        console.log(res.data);
        setSelectedDoctor(res.data);
        setReviewLoading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (e, id, message, rating) => {
    e.preventDefault();
    console.log(id, message, rating);
    if (!rating || rating == 0) {
      toast.error("Please also add rating!");
      return;
    }
    try {
      const res = await API.put("/ReviewUpdateAppointments", {
        appointmentid: id,
        message: message,
        rating,
      });
      if (res.data.success) {
        toast.success("Your review was successfully sent!");
        setCompletedAppointments((prev) =>
          prev.filter((app) => app._id !== id)
        );
        setAlreadyAppointments((prev) =>
          prev.map((app) =>
            app._id === id
              ? {
                  ...app,
                  rating,
                  message,
                  disabled: true,
                }
              : app
          )
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsReview(false);
      setRating(0);
      setUserReview(null);
      setSelectedDoctor([]);
    }
  };

  const SplitMessage = (message, length) => {
    const newlength =
      message.length > length ? message.slice(0, length) + "..." : message;
    return newlength;
  };

  const handleRating = (rating) => {
    if (rating <= 1) return <RatingStar />;
    if (rating > 1 && rating <= 2)
      return (
        <Rating>
          <RatingStar /> <RatingStar />
        </Rating>
      );
    if (rating > 2 && rating <= 3)
      return (
        <Rating>
          <RatingStar /> <RatingStar />
          <RatingStar />
        </Rating>
      );
    if (rating > 3 && rating <= 4)
      return (
        <Rating>
          <RatingStar /> <RatingStar />
          <RatingStar /> <RatingStar />
        </Rating>
      );
    return (
      <Rating>
        <RatingStar /> <RatingStar />
        <RatingStar /> <RatingStar />
        <RatingStar />
      </Rating>
    );
  };
  const handleDay = (date) => {
    const newdate = new Date(date);
    const dayName = newdate.toLocaleDateString("en-US", { weekday: "long" });
    return dayName;
  };
  const handleCancel = () => {
    if (CancelDelete.current) {
      CancelDelete.current.abort();
    }
    if (deletetimeout) clearTimeout(deletetimeout), setDeleteTimeout(null);
    setWaitDelete(false);
  };
  const DeleteAppointment = (id) => {
    const controller = new AbortController();
    CancelDelete.current = controller;
    setWaitDelete(true);
    const timeout = setTimeout(async () => {
      try {
        await API.delete("/DeleteAppointment", {
          data: { appointmentid: id },
          signal: controller.signal,
        });
        setAppointments((prev) =>
          prev.filter((appointment) => appointment._id !== id)
        );
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          console.log("Delete Canceled");
        } else {
          console.error(error);
        }
      } finally {
        setDeleteTimeout(null);
        setWaitDelete(false);
      }
    }, 2000);
    setDeleteTimeout(timeout);
  };

  return (
    <div>
      <div className="relative flex flex-col items-center z-10">
        <Navbar />
        {user ? (
          !loading ? (
            appointments && appointments.length > 0 ? (
              <div className="py-10 w-full flex flex-col items-center justify-center">
                <div className="flex justify-center py-10">
                  <h1 className="px-5 border-x-2 text-2xl md:text-3xl text-secondary border-secondary  hover-doubleline">
                    My Appointments
                  </h1>
                </div>
                <div className="w-full max-w-[90%] overflow-x-auto ">
                  <div className="block sm:min-w-[0%]">
                    <Table striped>
                      <TableHead>
                        <TableHeadCell>Doctor</TableHeadCell>
                        <TableHeadCell>Date</TableHeadCell>
                        <TableHeadCell>Time</TableHeadCell>
                        <TableHeadCell>Message</TableHeadCell>
                        <TableHeadCell>Delete</TableHeadCell>
                      </TableHead>
                      <TableBody className="divide-y">
                        {appointments.map((appointment) => (
                          <TableRow
                            className="bg-white dark:border-gray-700 dark:bg-gray-800 font-bold lora"
                            key={appointment._id}
                          >
                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {appointment.doctorname}
                            </TableCell>
                            <TableCell>{appointment.date}</TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>
                              {SplitMessage(appointment.message, 120)}
                            </TableCell>
                            <TableCell>
                              <Button
                                color="red"
                                className="border-2 rounded-full"
                                onClick={() =>
                                  DeleteAppointment(appointment._id)
                                }
                              >
                                <Trash2 />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-10">
                <Card className="max-w-sm w-full" horizontal>
                  <div className="flex ">
                    <div className="flex flex-[0.4] items-center px-5  ">
                      <figure className="w-full h-full overflow-hidden">
                        <img
                          src={getstarted}
                          alt="GetStarted.jpg"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </figure>
                    </div>
                    <div className="flex flex-col justify-center px-2">
                      <div className="w-1 bg-green-800 h-full mx-2 "></div>
                    </div>
                    <div className="flex flex-[0.6] flex-col gap-3 text-center justify-center ">
                      <h5 className=" text-lg font-bold text-secondary">
                        {" "}
                        You dont have any appointment!
                      </h5>
                      <p className="text-sm md:text-lg lora text-white tracking-wider">
                        To get started select a doctor and make sure to get an
                        appointment!
                      </p>
                      <div className="flex justify-end">
                        <Button color="green" className="w-[45%]">
                          <Link to={"/Home"}>Get Started</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center relative h-screen">
              <Spinner size="xl" />
            </div>
          )
        ) : (
          <div className="inset-0 z-50 fixed flex justify-center items-center backdrop:blur-md bg-black/80 ">
            <div className="border-2 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-md flex flex-col items-center justify-center w-[40%]">
              <ShieldX className="text-red-600 w-[50%] sm:w-[30%] h-[10%]" />
              <h3 className="mb-5 text-lg sm:text-xl font-bold text-secondary text-center">
                You are not registered!
              </h3>
              <div className="flex flex-col sm:flex-row  justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10">
                <Link to={"/Account"}>
                  <Button color="red">Sign Up</Button>
                </Link>
                <Link to={"/Home"}>
                  <Button color="alternative">Cancel</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-3 z-50">
          {completedappointments.length > 0 &&
            completedappointments.map((app) => (
              <Toast className=" opacity-90 animate-slide-right" key={app._id}>
                <div className="flex items-start">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center rounded-lg bg-secondary text-white ">
                    <FileChartColumn className="ml-2" />
                  </div>
                  <div className="ml-3 text-sm font-normal">
                    <span className="mb-1 text-sm font-semibold text-white ">
                      Appointment {app.date} by {app.doctorname} has been
                      completed !
                    </span>
                    <div className="mb-2 text-sm lora">
                      {" "}
                      Leave a review about the appointment!
                    </div>
                    <div className="flex gap-2">
                      <div className="w-auto">
                        <Button
                          className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:bg-gradient-to-br focus:ring-blue-300 dark:focus:ring-blue-800"
                          onClick={(e) => {
                            handleReview(e, app.doctorid),
                              setIsReview(true),
                              setReviewAppointment(app);
                          }}
                          size="xs"
                        >
                          Confirm
                        </Button>
                      </div>
                      <div className="w-auto">
                        <Button
                          color="light"
                          size="xs"
                          onClick={(e) => handleDisable(e, app._id)}
                        >
                          Not now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Toast>
            ))}
        </div>
        {alreadyappointments.length > 0 && (
          <div className="flex flex-col ">
            <div className="animate-fadeInScale">
              <h1 className="text-center py-5 text-xl sm:text-2xl md:text-3xl lg:text-4xl animate-text-blur anton-regular tracking-widest text-secondary">
                Already Completed Appointments{" "}
              </h1>
            </div>
            <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 h-[20wh] w-full gap-5 opacity-40 ">
              {alreadyappointments.map((app) => (
                <div
                  key={app._id}
                  className="relative  border-2 bg-white border-secondary animate-fadeInLeft"
                >
                  <div className="flex flex-1 justify-between">
                    <div className="flex flex-[.4] flex-col ">
                      <span className="font-bold lora tracking-wider px-2">
                        {app.fullname}
                      </span>
                      <div className="inline-flex flex-col gap-1 w-fit">
                        <Badge icon={Calendar} color="pink">
                          <span className="font-bold lora tracking-wider px-1">
                            {app.date}
                          </span>
                        </Badge>
                        <div>
                          <Badge icon={Clock} color="gray">
                            <span className="font-bold lora tracking-wider px-1">
                              {app.time}
                            </span>{" "}
                          </Badge>{" "}
                        </div>
                        <div>
                          <Badge icon={Clock} color="info">
                            <span className="font-bold lora tracking-wider px-1">
                              {handleDay(app.date)}
                            </span>{" "}
                          </Badge>
                        </div>{" "}
                      </div>
                    </div>
                    <div className="flex flex-[.6] justify-end items-center ">
                      <div className="border-2 border-gray-700/30 rounded-full p-2 relative right-5">
                        <FileUser className="w-full h-full text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="py-2 ">
                    <div className="flex flex-col">
                      <hr className="w-full  border-2 border-red-700" />
                      <div className="flex justify-between p-2">
                        <span className="anton-regular"> Your message</span>
                        {app.disabled === true ? (
                          <Badge
                            color="success"
                            className="inline-flex  items-center gap-2 whitespace-nowrap"
                          >
                            {" "}
                            <CheckCheck className="inline-flex" />{" "}
                            <span>Already reviewed!</span>
                          </Badge>
                        ) : (
                          <Badge
                            color="indigo"
                            className="inline-flex  items-center gap-2 whitespace-nowrap"
                          >
                            {" "}
                            <Info className="inline-flex" />{" "}
                            <span>No review was added!</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="overflow-y-auto mt-2">
                        <Textarea
                          value={app.message}
                          rows={3}
                          className="pointer-events-none "
                        />
                      </div>
                      <div>
                        <Badge
                          color="failure"
                          className="m-1 inline-flex rounded-full "
                        >
                          <BookMarked className="inline-flex mr-1" />
                          {app.reason}
                        </Badge>
                      </div>
                      <div className="flex p-2">
                        <span>
                          Appointment was made with
                          <span className="underline text-blue-500">
                            {" "}
                            {app.doctorname}
                          </span>
                        </span>
                      </div>
                      {app.rating ? (
                        <div className="flex flex-col items-center mt-2">
                          <hr className="w-full border-2 border-gray-400 mb-1" />
                          <span className="px-1 text-primary text-2xl mb-2">
                            Your ratings:
                          </span>
                          {handleRating(app.rating)}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 border-2 border-gray-500/30 rounded-xl p-1 ">
                          <span className="text-sm text-center">
                            There was no review added for this appointment
                          </span>
                          <Button
                            color="dark"
                            pill
                            onClick={(e) => {
                              handleReview(e, app.doctorid),
                                setIsReview(true),
                                setReviewAppointment(app);
                            }}
                          >
                            Add a review !
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {waitdelete && (
        <div className="fixed inset-0 z-50 backdrop:blur-sm bg-black/30">
          <div className="flex items-center justify-center relative h-screen">
            <Card className="min-w-[45%] min-h-[30%] bg-black/40">
              <div className="flex flex-col justify-center items-center py-5 ">
                <h5 className="changa-one text-white font-bold py-5 text-2xl">
                  Deleting Appointment !
                </h5>
                <div className="py-5 ">
                  <Spinner color="failure" aria-label="Failure" />
                </div>
              </div>
              <Button
                color="red"
                className="text-white relative right-0"
                pill
                onClick={handleCancel}
              >
                Cancel...
              </Button>
            </Card>
          </div>
        </div>
      )}
      {isreview && (
        <div className="fixed inset-0 z-50 blackdrop:blur-sm bg-black/30">
          <div className="flex items-center justify-center  h-screen ">
            <div className="flex flex-col rounded-lg  border-2 h-[80%] bg-gray-600 w-[80%] overflow-hidden">
              <span className="flex justify-between font-bold text-primary/80 p-4 text-xl  ">
                {" "}
                LEAVE A REVIEW !{" "}
                <NotebookPen className="text-gray-400 mx-3 mt-1" />
              </span>
              <div className="flex-1 border-2 overflow-auto bg-white border-white h-[91%]">
                {reviewloading ? (
                  <div className="flex flex-col gap-3 justify-center items-center  h-full">
                    <Spinner color="info" className="" />
                    <span className="">Loading Details...</span>
                  </div>
                ) : (
                  selecteddoctor && (
                    <form
                      onSubmit={(e) =>
                        handleSubmit(
                          e,
                          reviewappointment._id,
                          userreview,
                          rating
                        )
                      }
                    >
                      <div className="flex flex-col h-full items-center">
                        <div className="flex flex-col flex-1 sm:flex-row-reverse gap-2  justify-end bg-gray-600 ">
                          <div className="flex flex-[.4] items-center sm:items-end flex-col p-3  ">
                            <img
                              src={`https://appointment-backend-bfe4bydmhfdygbew.canadacentral-01.azurewebsites.net${selecteddoctor.img}`}
                              className="object-contain w-[40%] sm:w-[70%] rounded-lg"
                            />
                            <p className="text-lg font-bold text-white text-center sm:text-end">
                              {selecteddoctor.fullname}
                            </p>
                            <span className="text-sm text-white italic text-center sm:text-end">
                              {selecteddoctor.occupation}
                            </span>
                          </div>{" "}
                          <div className="flex flex-col flex-[.6] mt-2">
                            <div className="p-3 flex flex-col">
                              <span className="text-white">Message </span>
                              <Textarea
                                placeholder="Leave a quick review..."
                                required
                                rows={10}
                                onChange={(e) => setUserReview(e.target.value)}
                                maxLength={500}
                              />
                            </div>
                            <div className="flex flex-col items-center gap-2 mt-2">
                              <span className="flex flex-col items-center text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl gap-2 text-secondary  font-semibold">
                                How was your appointment ? <Sticker size={30} />{" "}
                              </span>
                              <div className="flex items-center py-5 gap-2">
                                <StarRating
                                  maxStars={5}
                                  onChange={(value) => setRating(value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-col mt-5">
                          <div className="flex gap-3">
                            <Button
                              type="submit"
                              className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white hover:bg-gradient-to-br focus:ring-teal-300 dark:focus:ring-teal-800"
                            >
                              {" "}
                              Send
                            </Button>
                            <Button
                              color="red"
                              onClick={() => (
                                setIsReview(false),
                                setUserReview(null),
                                setRating(0)
                              )}
                            >
                              {" "}
                              Return
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointmentPage;
