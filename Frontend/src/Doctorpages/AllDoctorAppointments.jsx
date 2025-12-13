import Navbar from "../Components/Navbar";
import { useAuth } from "../Context/CheckAuth";
import { useState } from "react";
import { Pagination } from "flowbite-react";
const DoctorAppointments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page) => setCurrentPage(page);
  const { user } = useAuth();
  return (
    <div className="relative flex flex-col z-10 ">
      <Navbar />;
      <div className="flex self-start p-5 ">
        <span className="text-white anton-regular tracking-wide text-xl md:text-2xl lg:text-3xl xl:text-4xl">
          What are we doing today, {user.fullname} ?
        </span>
      </div>
      <div className="flex flex-col  justify-start p-5  ">
        <div className="flex items-center justify-center sm:items-start sm:justify-start">
          <span className="text-white tracking-widest changa-one text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold hover-doubleline">
            Upcoming
          </span>
        </div>
        <div className="flex justify-center text-center sm:items-start sm:justify-start">
          <span className="text-white  tracking-widest  changa-one text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold hover-doubleline">
            {" "}
            Other Appointments
          </span>
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
