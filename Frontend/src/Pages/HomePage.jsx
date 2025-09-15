import { Card } from "flowbite-react";
import { useState, useEffect } from "react";
import { API } from "../Context/AppointmentAPI";
import NavBar from "../Menu/Navbar.jsx";
import doctor1 from "../assets/doctor1.png";

const HomePage = () => {
  const Doctors = {
    Doctor1: {
      fullname: "Dr. John Smith",
      occupation: "Cardiologist",
      description: "Expert in heart-related illnesses and treatments.",
      img: "https://via.placeholder.com/150?text=Doctor1",
    },
    Doctor2: {
      fullname: "Dr. Emily Johnson",
      occupation: "Pediatrician",
      description: "Specialist in children's health and wellness.",
      img: "https://via.placeholder.com/150?text=Doctor2",
    },
    Doctor3: {
      fullname: "Dr. Michael Brown",
      occupation: "Dermatologist",
      description: "Focused on skin conditions and cosmetic procedures.",
      img: "https://via.placeholder.com/150?text=Doctor3",
    },
    Doctor4: {
      fullname: "Dr. Sarah Davis",
      occupation: "Neurologist",
      description: "Deals with brain and nervous system disorders.",
      img: "https://via.placeholder.com/150?text=Doctor4",
    },
    Doctor5: {
      fullname: "Dr. William Wilson",
      occupation: "Orthopedic Surgeon",
      description: "Specializes in bones, joints, and musculoskeletal issues.",
      img: "https://via.placeholder.com/150?text=Doctor5",
    },
    Doctor6: {
      fullname: "Dr. Olivia Martinez",
      occupation: "Ophthalmologist",
      description: "Expert in eye care and vision correction.",
      img: "https://via.placeholder.com/150?text=Doctor6",
    },
    Doctor7: {
      fullname: "Dr. James Anderson",
      occupation: "Psychiatrist",
      description: "Focuses on mental health and psychological disorders.",
      img: "https://via.placeholder.com/150?text=Doctor7",
    },
    Doctor8: {
      fullname: "Dr. Sophia Thomas",
      occupation: "General Practitioner",
      description: "Provides overall medical care for all ages.",
      img: "https://via.placeholder.com/150?text=Doctor8",
    },
  };

  return (
    <div className="relative flex flex-col items-center z-10">
      <NavBar />
      <div className="animate-fadeInScale">
        <h1 className="animate-text-blur anton-regular tracking-widest py-10 flex items-center justify-center text-secondary text-7xl">
          OUR TEAM
        </h1>
      </div>

      <div className="py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10 px-10 ">
        {Object.values(Doctors).map((doctor, index) => (
          <div className="animate-fadeInBottom" key={index}>
            <Card
              className="h-full flex flex-col hover-border-animate cursor-pointer hover:border-3  max-w-sm  border"
              imgSrc={doctor1}
            >
              <div className="flex-1 flex flex-col p-1 ">
                <h5 className="text-2xl font-bold tracking-tight text-white">
                  {doctor.fullname}
                </h5>
                <span className="italic flex justify-end text-secondary mb-2">
                  {doctor.occupation}
                </span>
                <p className="font-normal text-gray-700 text-gray-400">
                  {doctor.description}
                </p>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
