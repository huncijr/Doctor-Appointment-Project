import NavBar from "../Components/Navbar.jsx";
import { useDoctor } from "../Context/DoctorContext.jsx";
import { use, useEffect } from "react";
import { Button } from "flowbite-react";
import AppointmentTable from "../Components/Table.jsx";
const AppointmentPage = () => {
  const { selecteddoctor, setSelectedDoctor } = useDoctor();

  const doctorsArray = Array.isArray(selecteddoctor)
    ? selecteddoctor
    : [selecteddoctor];

  return (
    <div className="relative flex flex-col justify-center z-10 w-full ">
      <NavBar />
      {doctorsArray.length === 1 ? (
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
            <div className=" flex-1 flex flex-col border-4 border-animated sm:w-2/3">
              <div className="relative overflow-hidden rounded-md h-0 pb-[100%]">
                <img
                  src={selecteddoctor.img}
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
                <Button className="rounded-full w-full bg-gradient-to-r from-secondary via-blue-secondary to-primary text-white hover:bg-gradient-to-br">
                  Add an appointment
                </Button>
                <Button color="light" pill className="w-full">
                  VIEW MY APPOINTMENTS
                </Button>
              </div>
            </div>

            <div className="flex-2  sm:w-2/3 self-start sm:self-auto overflow-x-auto">
              <AppointmentTable doctor={selecteddoctor} />
            </div>
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
                      src={doctor.img}
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
                    <Button className="rounded-full w-full bg-gradient-to-r from-secondary via-blue-secondary to-primary text-white hover:bg-gradient-to-br">
                      Add an appointment
                    </Button>
                    <Button color="light" pill className="w-full">
                      VIEW MY APPOINTMENTS
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-2  sm:w-2/3 self-start sm:self-auto overflow-x-auto w-full max-w-full">
              <AppointmentTable doctor={selecteddoctor} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
