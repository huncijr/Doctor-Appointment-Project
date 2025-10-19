import NavBar from "../Components/Navbar.jsx";
import {
  Label,
  TextInput,
  Datepicker,
  Checkbox,
  Textarea,
  Button,
} from "flowbite-react";
import { useDoctor } from "../Context/DoctorContext";
import { useEffect, useState } from "react";
const NewAppointment = () => {
  const { selecteddoctor } = useDoctor();
  function handleSubmit(e) {
    e.preventDefault();
  }

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
              <Label>Full Name</Label>
              <TextInput type="text" required sizing="sm" />
              <Label className="mt-5 ">Age</Label>
              <TextInput
                type="number"
                sizing="sm"
                className="w-[10%]"
                required
              />
              <div className="py-10">
                <span className=" text-lg text-white font-bold ">
                  PICK A DATE
                </span>
                <Datepicker inline className="flex justify-center" required />
              </div>

              <div className="max-w-md py-10">
                <div className="mb-2 block">
                  <Label required>Leave your problem</Label>
                </div>
                <Textarea
                  placeholder="Your problem or any comment..."
                  required
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-2 justify-end mb-2">
                <Checkbox />
                <Label className="flex">
                  I agree with the&nbsp;
                  <span className="text-cyan-600 hover:underline dark:text-cyan-500">
                    terms and conditions
                  </span>
                </Label>{" "}
              </div>
              <div className="flex justify-end ">
                <Button className=" bg-secondary" type="submit">
                  Submit
                </Button>
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
    </div>
  );
};

export default NewAppointment;
