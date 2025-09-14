import { Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { API } from "../Context/AppointmentAPI";

const HomePage = () => {
  console.log(test);
  return (
    <div>
      <div className="flex flex-col items-center h-screen justify-center ">
        <h1 className="underline text-2xl text-red-400">hello</h1>
        <Button className="bg-primary hover:bg-secondary text-base">
          Click me!
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
