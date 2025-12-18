import NavBar from "../Components/Navbar.jsx";
import {
  Label,
  TextInput,
  Checkbox,
  Textarea,
  Button,
  FloatingLabel,
  Dropdown,
  DropdownItem,
  Spinner,
  Toast,
  ToastToggle,
} from "flowbite-react";
import { useDoctor } from "../Context/DoctorContext";
import { useEffect, useState } from "react";
import { compareAsc, format } from "date-fns";
import { toast } from "react-hot-toast";
import { Link, useNavigate, ScrollRestoration } from "react-router-dom";
import { useAuth } from "../Context/CheckAuth.jsx";
import { useCookie } from "../Context/Cookies.jsx";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  CircleAlert,
  ThumbsUp,
  ShieldOff,
  RefreshCwOff,
  ShieldX,
  CircleX,
} from "lucide-react";
import { API } from "../Context/AppointmentAPI.js";
const NewAppointment = () => {
  const [age, SetAge] = useState(null);
  const [selecteddate, setSelectedDate] = useState(null);
  const [appointment, setAppointment] = useState([]);
  const [findappointments, setFindAppointments] = useState(null);
  const [merged, setMerged] = useState([]);
  const [availabledate, setAvailableDate] = useState(false);
  const [message, setMessage] = useState("");
  const [time, setTime] = useState(null);
  const [terms, setTerms] = useState(false);
  const [isopen, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showratelimiterToast, setShowRateLimiterToast] = useState(false);
  const [isdisable, setisDisable] = useState(false);
  const [openterms, setOpenTerms] = useState(false);
  const navigate = useNavigate();

  let mergedTimes = null;

  const maxLengthToast = (
    <div className="top-0 fixed left-0  gap-4 animate-slide-left">
      {" "}
      <Toast>
        <div className=" inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
          <ShieldOff className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">
          You can't make more than 5 appointments!
        </div>
        <ToastToggle />
      </Toast>
    </div>
  );
  const rateLimiterToast = (
    <div className="top-0 fixed right-0 gap-4 animate-slide-right">
      <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary ">
          <RefreshCwOff />
        </div>
        <div className="ml-3 text-sm font-normal">
          Limit reached, please wait!
        </div>
        <ToastToggle />
      </Toast>
    </div>
  );
  const { selecteddoctor, setSelectedDoctor } = useDoctor();
  const { user, setUser } = useAuth();
  const { cookies } = useCookie();

  useEffect(() => {
    if (user) {
      SetAge(user.age);
    }
  }, [user]);
  useEffect(() => {
    if (isopen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style = "auto";
    }
  }, [isopen]);
  useEffect(() => {
    if (openterms) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style = "auto";
    }
  }, [openterms]);

  useEffect(() => {
    if (submitted) {
      document.body.style.overflow = "hidden";
      let timer = setTimeout(() => {
        <ScrollRestoration />;
        navigate("/Home");
      }, 1500);
      return () => clearTimeout(time);
    }
  }, [submitted]);

  useEffect(() => {
    if (selecteddate) {
      let sendDate = parseDate(selecteddate);
      let formatdate = formatDate(sendDate);
      let [year, month, day] = formatdate.split("-");
      month = String(Number(month) + 1).padStart(2, "0");
      day = String(day).padStart(2, "0");
      let newDate = `${year}-${month}-${day}`;
      const FetchTimes = async () => {
        try {
          let result = await API.get("/GetTimes", {
            params: {
              doctorid: selecteddoctor._id || "",
              date: newDate,
            },
          });
          setFindAppointments(result.data);
        } catch (error) {
          console.error(error);
        }
      };
      FetchTimes();
    }
  }, [selecteddate]);
  useEffect(() => {
    mergedTimes = handleTime(
      Object.values(selecteddoctor.schedule)[0],
      findappointments
    );
    let weekday = handleWeekday(selecteddate);
    if (weekday) {
      setMerged(mergedTimes);
      setAvailableDate(false);
    } else {
      setMerged([]);
      setAvailableDate(true);
    }
  }, [findappointments]);

  function parseDate(date) {
    if (!date) return;
    const days = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    };
    const months = {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      Apr: "April",
      May: "May",
      Jun: "June",
      Jul: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December",
    };
    const dateStr = typeof date === "string" ? date : date.toString();
    let parts = dateStr.split(" ");
    let day = days[parts[0]];
    let month = months[parts[1]];
    let dayNumber = parts[2];
    let year = parts[3];
    return `${day} , ${month} ${dayNumber} , ${year}`;
  }
  function formatDate(date) {
    if (!date) return;
    const MonthDate = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };
    let parts = date.split(" ");
    let day = Number(parts[3]);
    let month = MonthDate[parts[2]];
    let year = parts[5];
    let newDate = format(new Date(year, month - 1, day), "yyyy-MM-dd");
    return newDate;
  }
  function handleFormatDate(date) {
    let dateparser = parseDate(date);
    let usersdate = formatDate(dateparser);
    let todaysDate = new Date();
    let year = todaysDate.getFullYear();
    let month = todaysDate.getMonth();
    let day = String(todaysDate.getDate()).padStart(2, "0");
    const newDate = `${year}-${month}-${day}`;

    const dates = [usersdate, newDate];
    console.log("dates", dates);

    if (dates[0] < dates[1] || dates[0] === dates[1]) {
      toast.error("Date is unavailable");
      return false;
    }
    return true;
  }
  // const test = parseDate(
  //   "Thu Dec 04 2025 00:00:00 GMT+0200 (Eastern European Standard Time)"
  // );
  //console.log(handleFormatDate(test));
  function handleTime(doctordates, appointmentdates) {
    if (!Array.isArray(appointmentdates)) {
      return doctordates.map((slot) => ({
        time: slot.time,
        reason: slot.reason || "",
      }));
    }
    const mergeddates = doctordates.map((dates) => {
      const merged = appointmentdates.find(
        (appointment) => dates.time === appointment.time
      );
      return {
        time: dates.time,
        reason: merged ? merged.reason : dates.reason,
      };
    });
    return mergeddates;
  }
  function handleWeekday(date) {
    let weekday = new Date(date).toLocaleString("en-US", {
      weekday: "long",
    });
    console.log(weekday);
    switch (weekday) {
      case "Saturday":
        return false;
      case "Sunday":
        return false;
      default:
        return true;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;
    if (!selecteddate) {
      toast.error("Select a day!");
      return;
    }
    if (!time) {
      toast.error("Select a time!");
      return;
    }
    if (!terms) {
      toast.error("Our terms and condition wasnt accepted!");
      return;
    }
    if (!handleFormatDate(selecteddate)) {
      return;
    }
    let sendDate = parseDate(selecteddate);
    let formatdate = formatDate(sendDate);
    let [year, month, day] = formatdate.split("-");
    month = String(Number(month) + 1).padStart(2, "0");
    day = String(day).padStart(2, "0");
    let newDate = `${year}-${month}-${day}`;
    console.log(newDate);
    try {
      let response = await API.post("Appointment", {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        age: user.age,
        doctorid: selecteddoctor._id,
        doctorname: selecteddoctor.fullname,
        date: newDate,
        time: time,
        message: message,
        reason: "Reserved",
        completed: false,
        disabled: false,
      });
      setAppointment(response.data);
      setSelectedDate(null);
      setTime(null);
      setTerms(false);
      setSubmitted(true);
    } catch (error) {
      if (error && error.response.status === 409) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      }
      if (error && error.response.status === 429) {
        setisDisable(true);
        setShowRateLimiterToast(true);
        setTimeout(() => {
          setisDisable(false);
        }, 20000);
        setTimeout(() => {
          setShowRateLimiterToast(false);
        }, 5000);
      }
      console.error(error);
    }
  }
  useEffect(() => {
    console.log(merged);
  }, [merged]);
  useEffect(() => {
    console.log(selecteddate);
  }, [selecteddate]);

  return (
    <div className="relative flex flex-col items-center z-10">
      <NavBar />
      <div className=" p-10">
        <h1 className="text-2xl md:text-3xl border-x-2 font-bold px-5 text-secondary text-center">
          Make a new appointment
        </h1>
      </div>

      <div className=" w-[80%] py-10">
        <div className="min-h-screen rounded-lg border-2 border-secondary ">
          <div className="flex flex-col p-5">
            <form onSubmit={(e) => handleSubmit(e)}>
              <Label className="mt-5 ">Age</Label>
              <TextInput
                type="number"
                sizing="sm"
                value={age}
                onChange={(e) => SetAge(e.target.value)}
                className="w-[22%] sm:w-[13%] md:w-[10%] lg:w-[8%] "
                required
              />
              <div className="py-10">
                <div className="flex flex-col text-center">
                  <Label className="py-5 text-lg text-white font-bold ">
                    PICK A DATE
                  </Label>
                  <div className="relative ">
                    <Datepicker
                      className="max-w-full  "
                      value={selecteddate}
                      onChange={(date) => setSelectedDate(date)}
                      inline
                      required
                    />
                  </div>
                </div>
              </div>
              <Label className=" text-lg text-white font-bold ">
                {" "}
                Your date:
              </Label>
              <div className="grid grid-cols-7">
                <div className={availabledate ? "col-span-6" : "col-span-7"}>
                  <FloatingLabel
                    variant="filled"
                    label="Date"
                    color="success"
                    disabled
                    value={parseDate(selecteddate)}
                  />
                </div>
                {availabledate && (
                  <div className=" flex flex-col justify-center  items-center p-2  ">
                    <ShieldOff className="text-orange-700 sm:h-[4vh] sm:w-[5vw] border-2 rounded-full border-black bg-black " />
                    <p className="text-[10%] lg:text-lg text-secondary/70 text-center">
                      the date is not available
                    </p>
                  </div>
                )}
              </div>

              <div className="py-10 ">
                <Label className=" text-lg text-white font-bold ">
                  {" "}
                  Choose your time:
                </Label>
                <div className="mt-3">
                  <Dropdown
                    label={time}
                    size="lg"
                    className="text-xl font-bold border-secondary  border-2"
                  >
                    {merged &&
                      merged.map((slot, index) => (
                        <div key={index} className="flex justify-start px-1">
                          <DropdownItem
                            onClick={() => setTime(slot.time)}
                            disabled={slot.reason}
                            className="bungee-inline text-sm "
                          >
                            {slot.reason ? (
                              <span>
                                {" "}
                                {slot.time} -{" "}
                                <span className="text-red-600">
                                  Unavailable
                                </span>
                              </span>
                            ) : (
                              <span>
                                {slot.time} -{" "}
                                <span className="text-green-700">
                                  Available
                                </span>
                              </span>
                            )}
                          </DropdownItem>
                        </div>
                      ))}
                  </Dropdown>
                </div>
              </div>

              <div className="max-w-md py-10">
                <div className="mb-2 block">
                  <Label required>Leave your problem</Label>
                </div>
                <Textarea
                  placeholder="Your problem or any comment..."
                  required
                  rows={4}
                  maxLength={300}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 justify-end mb-2">
                <Checkbox onClick={() => setTerms(!terms)} />
                <Label className="flex">
                  I agree with the&nbsp;
                  <span
                    className="text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                    onClick={() => setOpenTerms(true)}
                  >
                    terms and conditions
                  </span>
                </Label>{" "}
              </div>
              <div className="flex justify-end ">
                {user ? (
                  <Button
                    className=" bg-secondary"
                    type="submit"
                    disabled={isdisable}
                  >
                    Submit
                  </Button>
                ) : (
                  <div>
                    <Button
                      type="submit"
                      className=" bg-secondary"
                      onClick={() => setOpen(true)}
                    >
                      Submit
                    </Button>
                    {isopen && (
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
                )}
              </div>
              <div className="flex justify-end mt-1 ">
                <span className="text-white/20 text-sm">
                  your appointment will be scheduled with
                  <span className=" text-white/50">{` ${selecteddoctor.fullname}`}</span>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-secondary/30">
          <div className="bg-secondary/100 border-2 rounded-2xl shadow-2xl w-[70%] max-w-lg p-6 flex flex-col items-center space-y-6">
            <div className="flex items-center justify-center gap-4 w-full">
              <span className="text-green-500 text-3xl sm:text-4xl changa-one font-bold tracking-wide">
                Success!
              </span>
              <div className="rounded-full p-2 animate-pulse w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <ThumbsUp className="w-full h-full text-blue-500" />
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <Spinner color="success" aria-label="Loading" size="xl" />
              <span className="text-sm sm:text-base text-primary/70 text-center">
                Redirecting to home...
              </span>
            </div>
          </div>
        </div>
      )}
      <div>{showToast && maxLengthToast}</div>
      <div>{showratelimiterToast && rateLimiterToast}</div>
      <div>
        {openterms && (
          <div className="fixed inset-0 z-10 bg-black/50 flex justify-center items-center">
            <div className="flex flex-col items-end justify-end relative bg-gray-300 w-[90%] max-h-[80%] overflow-y-auto p-1 rounded-lg shadow-lg">
              <div className="p-1">
                <button
                  className="rounded-full p-2 hover:bg-red-700 hover:text-white"
                  onClick={() => setOpenTerms(false)}
                >
                  <CircleX />
                </button>
              </div>
              <Textarea
                rows={30}
                className="bg-primary text-black"
                value="Terms and Conditions 

1. Introduction
Welcome to this platform! These terms are provided purely as an example and do not create any legal obligations. By using the platform, you acknowledge that this is for demonstration purposes only.

2. Use of the Service
Using the service is entirely optional. No real user data is collected, and we do not take responsibility for any handling of actual data.

3. Account Creation
While account creation is technically possible, any information provided here is not processed in reality and is not connected to any real service.

4. Privacy
All information entered is solely for demonstration purposes. No data is analyzed, or shared with third parties.

5. Content
All content on this platform is entirely fictional, including text, images, and other elements. Nothing represents reality and is not intended as advice.

6. Disclaimer of Liability
Use of this service is entirely at the user’s own risk. We accept no responsibility for any harm arising from using these example texts.

7. Restrictions
Elements on the platform cannot be used for real business or legal purposes.
Texts and content serve demonstration purposes only.
All references and functions are fictional and do not trigger any real processes.

8.Changes to Terms
We reserve the right to modify these terms at any time without notice. Any changes automatically take effect, but since this is an example, they are illustrative only.

9. Contact
No real contact forms or channels are handled.

10. Other Provisions
This document exists solely for educational and demonstration purposes.
It does not create any real legal or financial obligations.
Users acknowledge that all information here is strictly an example."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewAppointment;
