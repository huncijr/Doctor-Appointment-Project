import NavBar from "../Menu/Navbar.jsx";
import { useDoctor } from "../Context/DoctorContext.jsx";
import { useEffect } from "react";
import { Button } from "flowbite-react";
const AppointmentPage = () => {
  const { selecteddoctor, setSelectedDoctor } = useDoctor();
  return (
    <div className="relative flex flex-col justify-center z-10 w-full ">
      <NavBar />
      <div className=" flex justify-center py-10">
        <h1
          className="px-5  border-x-2 text-2xl md:text-3xl
             text-secondary border-secondary"
        >
          APPOINTMENT
        </h1>
      </div>
      <div className="p-10 gap-4 sm:justify-evenly flex flex-col sm:flex-row ">
        <div className="flex flex-col justify-end">
          <div className="border-4 relative  border-animated">
            <figure className=" h-[50vh] sm:h-[40vh] md:h-[60vh] lg:h-[80vh] ">
              <img
                src={selecteddoctor.img}
                className="w-full h-full object-cover"
              />
            </figure>
            <h1 className="text-white">{selecteddoctor.fullname}</h1>
            <h1 className="text-white">{selecteddoctor.occupation}</h1>
            <h1 className="text-white">{selecteddoctor.description}</h1>
          </div>
          <div className="flex flex-col items-center">
            <Button className="rounded-full mt-5 bg-gradient-to-r from-secondary via-blue-secondary to-primary text-white hover:bg-gradient-to-br focus:ring-base dark:focus:primary">
              Add an appointment
            </Button>
            <Button color="light" pill className="mt-4">
              VIEW MY APPOINTMENTS
            </Button>
          </div>
        </div>

        <div className="border-2 flex-1 ">table</div>
      </div>
    </div>
  );
};

export default AppointmentPage;
