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
} from "flowbite-react";
import { ShieldX } from "lucide-react";
import { API } from "../Context/AppointmentAPI";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/CheckAuth";
import { Link } from "react-router-dom";

const AllAppointmentPage = () => {
  const { user, setUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await API.get("GetAppointment", {
          params: {
            userid: user._id,
          },
        });
        setAppointments(res.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("nem kaptam");
          return;
        }
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchAppointment();
    }
  }, [user]);
  useEffect(() => {
    console.log(appointments);
  }, [appointments]);
  return (
    <div>
      <div className="relative flex flex-col items-center z-10">
        <Navbar />
        {user ? (
          !loading ? (
            appointments ? (
              <div className="flex flex-col items-center">
                <div className="py-10 overflow-x-auto">
                  <Table striped>
                    <TableHead>
                      <TableHeadCell>Doctor</TableHeadCell>
                      <TableHeadCell>Date</TableHeadCell>
                      <TableHeadCell>Time</TableHeadCell>
                      <TableHeadCell>Name</TableHeadCell>
                      <TableHeadCell>Delete</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                      <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          aaa
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div>
                <Card className="max-w-sm" imgSrc="" horizontal>
                  <h5 className="lora text-lg text-secondary">
                    {" "}
                    You dont have any appointment
                  </h5>
                  <p className="text-sm anton-regular">
                    To get started select a doctor and make sure to get an
                    appointment!
                  </p>
                  <Button>Get Started</Button>
                </Card>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center relative h-screen">
              <Spinner aria-label="Extra large spinner example" size="xl" />
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
      </div>
    </div>
  );
};

export default AllAppointmentPage;
