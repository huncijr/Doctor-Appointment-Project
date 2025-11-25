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
} from "flowbite-react";
import { useDoctor } from "../Context/DoctorContext";
import { useEffect, useState } from "react";
import { compareAsc, format } from "date-fns";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/CheckAuth.jsx";
import { useCookie } from "../Context/Cookies.jsx";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CircleAlert, ThumbsUp } from "lucide-react";
import { API } from "../Context/AppointmentAPI.js";
const NewAppointment = () => {
  const [age, SetAge] = useState(null);
  const [selecteddate, setSelectedDate] = useState(null);
  const [appointment, setAppointment] = useState([]);
  const [message, setMessage] = useState("");
  const [time, setTime] = useState(null);
  const [terms, setTerms] = useState(false);
  const [isopen, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const { selecteddoctor } = useDoctor();
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
    console.log(isopen);
  }, [isopen]);

  useEffect(() => {
    if (submitted) {
      document.body.style.overflow = "hidden";
      let timer = setTimeout(() => {
        navigate("/home");
      }, 1500);
      return () => clearTimeout(time);
    }
  }, [submitted]);

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
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };
    let parts = date.split(" ");
    let day = Number(parts[3]);
    let month = MonthDate[parts[2]];
    let year = parts[5];
    let newDate = format(new Date(year, month, day), "yyyy-MM-dd");
    console.log(newDate);
    return newDate;
  }
  function handleFormatDate(date) {
    let dateparser = parseDate(date);
    let usersdate = formatDate(dateparser);
    let todaysDate = new Date();
    let year = todaysDate.getFullYear();
    let month = todaysDate.getMonth();
    let day = todaysDate.getDate();
    const newDate = `${year}-${month}-${day}`;

    const dates = [usersdate, newDate];
    //console.log("dates", dates);

    if (dates[0] < dates[1]) {
      toast.error("Date is unavailable");
      return;
    }
  }
  // const test = parseDate(
  //   "Thu Dec 04 2025 00:00:00 GMT+0200 (Eastern European Standard Time)"
  // );
  //console.log(handleFormatDate(test));

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
    handleFormatDate(selecteddate);
    try {
      let response = await API.post("Appointment", {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        age: user.age,
        doctor: selecteddoctor._id,
        date: selecteddate,
        time: time,
        message: message,
      });
      setAppointment(response.data);
      setSelectedDate(null);
      setTime(null);
      setTerms(false);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    console.log(selecteddoctor);
  }, [selecteddoctor]);

  return (
    <div className="relative flex flex-col items-center z-10">
      <NavBar />
      <div className=" p-10">
        <h1 className="text-2xl md:text-3xl border-x-2 font-bold px-5 text-secondary">
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
              <FloatingLabel
                variant="filled"
                label="Date"
                color="success"
                disabled
                value={parseDate(selecteddate)}
              />
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
                    {Object.values(selecteddoctor.schedule)[0]?.map(
                      (slot, index) => (
                        <div key={index}>
                          <DropdownItem
                            onClick={() => setTime(slot.time)}
                            disabled={!slot.reason}
                          >
                            {slot.reason ? (
                              <span>{slot.time} - Available</span>
                            ) : (
                              <span>
                                {slot.time} -
                                <span className="text-red-600">
                                  {" "}
                                  Unavailable{" "}
                                </span>
                              </span>
                            )}
                          </DropdownItem>
                        </div>
                      )
                    )}
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
                  <span className="text-cyan-600 hover:underline dark:text-cyan-500">
                    terms and conditions
                  </span>
                </Label>{" "}
              </div>
              <div className="flex justify-end ">
                {user ? (
                  <Button className=" bg-secondary" type="submit">
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
    </div>
  );
};

export default NewAppointment;
