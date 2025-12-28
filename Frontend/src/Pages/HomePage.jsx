import {
  Card,
  Carousel,
  Progress,
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { API } from "../Context/AppointmentAPI";
import NavBar from "../Components/Navbar.jsx";
import { MoveLeft, MoveRight } from "lucide-react";
import placeinside from "../Places/placeinside.png";
import placeoutside from "../Places/placeoutside.png";
import place3 from "../Places/place3.png";
import { useDoctor } from "../Context/DoctorContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [slide, setSlide] = useState([placeoutside, placeinside, place3]);
  const [currentslide, setCurrentSlide] = useState(0);
  const [time, setTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [slidedirection, setSlideDirection] = useState("right");
  const intervalRef = useRef(null);
  const { selecteddoctor, setSelectedDoctor } = useDoctor();
  const [doctors, setDoctors] = useState(null);
  const navigate = useNavigate();
  IMAGE_BASE_URL =
    import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL);
    console.log("hello");
    const getDoctors = async () => {
      try {
        const res = await API.get("/AllDoctor");
        setDoctors(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getDoctors();
  }, []);
  useEffect(() => {
    setSelectedDoctor([]);
  }, []);

  useEffect(() => {
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += 1;
      if (current > 100) {
        current = 0;
        setCurrentSlide((prev) => (prev + 1) % slide.length);
      }
      setProgress(current);
    }, 50);
    return () => clearInterval(intervalRef.current);
  }, []);

  function Nextslide() {
    setSlideDirection("right");
    clearInterval(intervalRef.current);
    setProgress(0);
    setCurrentSlide((prev) => (prev + 1) % slide.length);

    let current = 0;
    intervalRef.current = setInterval(() => {
      current += 1;
      if (current > 100) {
        current = 0;
        setCurrentSlide((prev) => (prev + 1) % slide.length);
      }
      setProgress(current);
    }, 50);
  }
  function PrevSlide() {
    setSlideDirection("left");
    clearInterval(intervalRef.current);
    setProgress(0);

    setCurrentSlide((prev) => (prev - 1 + slide.length) % slide.length);

    let current = 0;
    intervalRef.current = setInterval(() => {
      current += 1;
      if (current > 100) {
        current = 0;
        setCurrentSlide((prev) => (prev + 1) % slide.length);
        setSlideDirection("right");
      }
      setProgress(current);
    }, 50);
  }

  const handleClick = async (doctor) => {
    try {
      const res = await API.get(`Doctor?occupation=${doctor.occupation}`);
      if (res.data.length > 1) {
        setSelectedDoctor(res.data);
      } else {
        setSelectedDoctor(res.data[0]);
      }
      // console.log(res.data);
      navigate(`/Appointment/${doctor.fullname}`, {
        state: { doctor: res.data },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative flex flex-col items-center z-10">
      <NavBar />
      <div className="flex flex-col items-center">
        <div className="animate-fadeInScale">
          <h1 className="animate-text-blur anton-regular tracking-widest py-14 flex items-center justify-center text-secondary text-6xl">
            {" "}
            Our Place
          </h1>
        </div>
        <div className="py-5 flex items-center justify-center px-4 sm:px-auto">
          <button
            onClick={PrevSlide}
            className=" h-[4vh] w-[4vw] rounded-full text-base relative mr-3"
          >
            <MoveLeft />
          </button>
          <div className="border rounded-lg h-[50vw] w-[80vw] sm:h-[40vw] sm:w-[60vw]">
            <figure className="w-full h-full">
              <img
                key={`${currentslide}`}
                className={`object-cover w-full h-full ${
                  slidedirection === "right"
                    ? "animate-slide-right"
                    : "animate-slide-left"
                }`}
                src={slide[currentslide]}
              />
            </figure>
          </div>
          <button
            onClick={Nextslide}
            className="h-[4vh] w-[4vw] rounded-full text-base relative ml-3 "
          >
            <MoveRight />
          </button>
        </div>
        <div className="mb-3 w-[60%] h-full">
          <div className="space-y-1">
            <Progress progress={progress} color="cyan" />
          </div>
        </div>
        <div className="animate-fadeInScale">
          <h1 className="animate-text-blur anton-regular tracking-widest py-10 flex items-center justify-center text-secondary text-7xl">
            OUR TEAM
          </h1>
        </div>
        <div className="py-10 md:px-12 lg:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 px-10 ">
          {doctors &&
            Object.values(doctors).map((doctor) => (
              <div
                className="animate-fadeInBottom"
                onClick={() => handleClick(doctor)}
                key={doctor._id}
              >
                <Card className="h-full flex flex-col hover-border-animate cursor-pointer hover:border-3  max-w-sm  border">
                  <div className="flex-1 flex flex-col p-1 ">
                    <figure className="h-80 overflow-hidden rounded-md w-full object-cover border-b-2 py-2 mb-2 border-secondary">
                      <img
                        src={`${IMAGE_BASE_URL}${doctor.img}`}
                        alt="No image "
                        className="text-white w-full h-full object-cover  min-w-[100%] min-h-[100%]"
                      />
                    </figure>
                    <h5 className="text-2xl font-bold tracking-tight text-white">
                      {doctor.fullname}
                    </h5>
                    <span className="italic flex justify-end text-secondary mb-2">
                      {doctor.occupation}
                    </span>
                    <p className="font-normal text-gray-700">
                      {doctor.description}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
        </div>
        <div className="mt-10 px-5">
          <div className="animate-fadeInScale">
            <h1 className="animate-text-blur anton-regular tracking-widest py-14 flex items-center justify-center text-secondary text-7xl">
              {" "}
              FAQ
            </h1>
          </div>
          <Accordion className="flex flex-col ">
            <AccordionPanel>
              <AccordionTitle>
                Is this a real medical appointment system?
              </AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  No, this is a fictitious appointment system created solely for
                  testing and demonstration purposes. It is not connected to any
                  real healthcare provider
                </p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle>
                Where can I find more information about your projects?
              </AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  You can explore more of my work and source code on my
                  <a
                    href="https://github.com/huncijr"
                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    {" "}
                    GitHub profile
                  </a>
                  .There you will find detailed documentation, examples of
                  different technologies I have worked with, and a variety of
                  projects ranging from front-end applications to full-stack
                  solutions. Browsing through the repositories will give you a
                  clearer picture of my coding style, problem-solving approach,
                  and the kind of software I like to build.
                </p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle>How do I book an appointment?</AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Simply choose your preferred doctor from the list, select a
                  date and time slot that is available, and confirm your
                  appointment.
                </p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle>
                Can I cancel or reschedule an appointment?
              </AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Yes, you can cancel or reschedule an appointment through the
                  appointment management page.
                </p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle>How Can I see my appointments?</AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  You can view your appointments either in the table of the
                  specific doctor you booked with or in the general appointments
                  section.
                </p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle>
                Will I receive reminders for my appointment?
              </AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  No, you will not receive a notification because the user is
                  not linked to an email address or phone number.
                </p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle>Is my personal information safe?</AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Yes, all personal data is securely stored and protected with
                  encryption. The system follows best practices to ensure
                  patient confidentiality and data safety.
                </p>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
