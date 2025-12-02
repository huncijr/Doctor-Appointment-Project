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
import { ShieldX, Trash2 } from "lucide-react";
import { API } from "../Context/AppointmentAPI";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../Context/CheckAuth";
import { Link } from "react-router-dom";
import { Appointment } from "../../../Backend/DataBase/Schemas";
import axios from "axios";
import getstarted from "../other pics/getstarted.png";

const AllAppointmentPage = () => {
  const { user, setUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waitdelete, setWaitDelete] = useState(false);
  const [deletetimeout, setDeleteTimeout] = useState(null);

  const CancelDelete = useRef();
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await API.get("GetAppointment", {
          params: {
            userid: user._id,
          },
        });
        setAppointments(res.data.appointments);
      } catch (error) {
        if (error.response && error.response.status === 404) {
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
    // console.log(appointments);
  }, [appointments]);

  const SplitDate = (date) => {
    let newdate = date.slice(0, date.indexOf("T"));
    return newdate;
  };
  const SplitMessage = (message, length) => {
    const newlength =
      message.length > length ? message.slice(0, length) + "..." : message;
    return newlength;
  };
  const handleCancel = () => {
    if (CancelDelete.current) {
      CancelDelete.current.abort();
    }
    if (deletetimeout) clearTimeout(deletetimeout), setDeleteTimeout(null);
    setWaitDelete(false);
  };
  const DeleteAppointment = (id) => {
    console.log(id);
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
                <div className="w-full max-w-[90%] overflow-x-auto">
                  <div className="inline-block sm:min-w-[0%]">
                    <Table striped className=" ">
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
                            <TableCell>{SplitDate(appointment.date)}</TableCell>
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
    </div>
  );
};

export default AllAppointmentPage;
