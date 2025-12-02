import { StepBack, StepForward } from "lucide-react";
import { useEffect, useState } from "react";
import { API } from "../Context/AppointmentAPI";

const AppointmentTable = ({ doctor }) => {
  const [appointments, setAppointments] = useState(null);

  useEffect(() => {
    const GetAppointment = async () => {
      try {
        const ids = Array.isArray(doctor)
          ? doctor.map((d) => d._id).join(",")
          : doctor._id;

        const res = await API.get("GetAllappointment", {
          params: { doctorIds: ids },
        });

        setAppointments(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    GetAppointment();
  }, []);
  useEffect(() => {
    //console.log(appointments);
    //console.log(doctor.schedule);
  }, [appointments]);

  function mergeSchedules(doctors, appointments = []) {
    if (!doctors) return null;
    //console.log(doctor.schedule);
    console.log(appointments);

    const docs = Array.isArray(doctors) ? doctors : [doctors];
    let merged = {};

    docs.forEach((doc) => {
      if (!doc.schedule) return;

      Object.entries(doc.schedule).forEach(([day, slots]) => {
        if (!merged[day]) merged[day] = [];

        slots.forEach((slot) => {
          if (!merged[day].some((s) => s.time === slot.time)) {
            merged[day].push({
              time: slot.time,
              reason: slot.reason || "",
            });
          }
        });
      });
    });

    if (Array.isArray(appointments)) {
      appointments.forEach((appt) => {
        if (!appt || !appt.date) return;

        const day = new Date(appt.date).toLocaleDateString("en-US", {
          weekday: "long",
        });
        console.log(day);
        if (!merged[day]) merged[day] = [];

        const index = merged[day].findIndex((s) => s.time === appt.time);
        if (index !== -1) {
          merged[day][index].reason = appt.reason || "Reserved";
          console.log(merged[day][index].reason);
        } else {
          merged[day].push({
            time: appt.time,
            reason: appt.reason || "Reserved",
          });
        }
      });
    }
    //console.log(merged);
    return merged;
  }

  function getDaySlots(day, schedulesData) {
    if (!schedulesData) return [];
    return schedulesData[day] || [];
  }

  const schedulesData = mergeSchedules(doctor, appointments);
  if (!schedulesData) return null;

  const days = Object.keys(schedulesData);
  const hours = schedulesData[days[0]].map((s) => s.time);

  function handleReasons(reason) {
    switch (reason) {
      case "Lunch Break":
        return { backgroundColor: "#AC9D13" };
      case "Conference":
        return { backgroundColor: "#07680B" };
      case "Reserved":
        return { backgroundColor: "#CB2020" };
      case "Personal":
        return { backgroundColor: "#AC510B" };
      case "Meeting":
        return { backgroundColor: "#56179E" };
      case "Important":
        return { backgroundColor: "#79100D" };
      default:
        return {};
    }
  }

  function handleClickBack() {}
  function handleClickForward() {}

  return (
    <div className="overflow-x-auto bg-white">
      <div className="flex justify-between text-center items-center">
        <button className="px-10" onClick={handleClickBack}>
          <StepBack />
        </button>
        <h1 className="py-10 text-xl font-bold">THIS WEEK</h1>
        <button className="px-10" onClick={handleClickForward}>
          <StepForward />
        </button>
      </div>

      <table className="border-collapse border border-gray-400 w-full text-center">
        <thead>
          <tr>
            <th className="border bg-white border-gray-400 px-2 py-1"></th>
            {days.map((day, i) => (
              <th key={i} className="border bg-white border-gray-400 px-2 py-1">
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {hours.map((hour, i) => (
            <tr key={i}>
              <td className="border bg-white border-gray-400 px-2 py-1 font-medium">
                {hour}
              </td>

              {days.map((day, j) => {
                const slots = getDaySlots(day, schedulesData);
                const slot = slots[i] || { reason: "" };

                return (
                  <td
                    key={j}
                    className={`border-2 border-gray-400 px-2 py-1 text-white ${
                      slot.reason ? "bg-blue-800" : "bg-green-200"
                    }`}
                    style={handleReasons(slot.reason)}
                  >
                    {slot.reason || ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
