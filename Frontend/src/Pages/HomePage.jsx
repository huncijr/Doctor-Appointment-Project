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
import NavBar from "../Menu/Navbar.jsx";
import { MoveLeft, MoveRight } from "lucide-react";
import doctor1 from "../Doctors/doctor1.png";
import doctor2 from "../Doctors/doctor2.png";
import doctor3 from "../Doctors/doctor3.png";
import doctor4 from "../Doctors/doctor4.png";
import doctor5 from "../Doctors/doctor5.png";
import doctor6 from "../Doctors/doctor6.png";
import doctor7 from "../Doctors/doctor7.png";
import place1 from "../Places/place1.webp";
import place2 from "../Places/place2.webp";
import place3 from "../Places/place3.webp";
import { useDoctor } from "../Context/DoctorContext.jsx";

const HomePage = () => {
  const [slide, setSlide] = useState([place1, place2, place3]);
  const [currentslide, setCurrentSlide] = useState(0);
  const [time, setTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [slidedirection, setSlideDirection] = useState("right");
  const intervalRef = useRef(null);
  const { selecteddoctor, setSelectedDoctor } = useDoctor();

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
  useEffect(() => {
    console.log(selecteddoctor);
  }, [selecteddoctor]);
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

  const Doctors = {
    Doctor1: {
      fullname: "Dr. John Smith",
      occupation: "Cardiologist",
      description: "Expert in heart-related illnesses and treatments.",
      img: doctor5,
    },
    Doctor2: {
      fullname: "Dr. Emily Johnson",
      occupation: "Pediatrician",
      description: "Specialist in chidren's health and wellness.",
      img: doctor1,
    },
    Doctor3: {
      fullname: "Dr. Michael Brown",
      occupation: "Dermatologist",
      description: "Focused on skin conditions and cosmetic procedures.",
      img: doctor2,
    },
    Doctor4: {
      fullname: "Dr. Sarah Davis",
      occupation: "Neurologist",
      description: "Deals with brain and nervous system disorders.",
      img: doctor4,
    },
    Doctor5: {
      fullname: "Dr. William Wilson",
      occupation: "Orthopedic Surgeon",
      description: "Specializes in bones, joints, and musculoskeletal issues.",
      img: doctor3,
    },
    Doctor6: {
      fullname: "Dr. Olivia Martinez",
      occupation: "Ophthalmologist",
      description: "Expert in eye care and vision correction.",
      img: doctor7,
    },
    Doctor7: {
      fullname: "Dr. James Anderson",
      occupation: "Psychiatrist",
      description: "Focuses on mental health and psychological disorders.",
      img: doctor6,
    },
    Doctor8: {
      fullname: "Dr. Sophia Thomas",
      occupation: "General Practitioner",
      description: "Provides overall medical care for all ages.",
      img: "https://via.placeholder.com/150?text=Doctor8",
    },
  };
  const handleClick = (doctor) => {
    setSelectedDoctor(doctor);
  };

  return (
    <div className="relative flex flex-col items-center z-10">
      <NavBar />
      <div className="flex flex-col items-center">
        <div className="animate-fadeInScale">
          <h1 className="animate-text-blur anton-regular tracking-widest py-14 flex items-center justify-center text-secondary text-7xl">
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
          {Object.values(Doctors).map((doctor, index) => (
            <div
              className="animate-fadeInBottom"
              onClick={() => handleClick(doctor)}
              key={index}
            >
              <Card className="h-full flex flex-col hover-border-animate cursor-pointer hover:border-3  max-w-sm  border">
                <div className="flex-1 flex flex-col p-1 ">
                  <figure className="h-80 overflow-hidden rounded-md w-full object-cover border-b-2 py-2 mb-2 border-secondary">
                    <img
                      src={doctor.img}
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
          <Accordion>
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
                  appointment. You will then receive a confirmation
                  notification.
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
                  appointment management page. Changes can be made up to 24
                  hours before the scheduled time.
                </p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle>
                Can I cancel or reschedule an appointment?
              </AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Simply choose your preferred doctor from the list, select a
                  date and time slot that is available, and confirm your
                  appointment. You will then receive a confirmation
                  notification.
                </p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle>
                Will I receive reminders for my appointment?
              </AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Yes, once your appointment is confirmed, you will receive
                  reminders via email or SMS (depending on your chosen
                  notification settings) prior to your visit.
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
