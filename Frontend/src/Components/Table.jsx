import { StepBack, StepForward } from "lucide-react";
import { useEffect, useState } from "react";
import { API } from "../Context/AppointmentAPI";
const AppointmentTable = ({ doctor }) => {
  const [appointments, setAppointments] = useState(null);
  useEffect(() => {
    const GetAppointment = async () => {
      const ids = Array.isArray(doctor) ? doctor.map((d) => d._id) : doctor._id;
      console.log(ids);
      let res;
      try {
        if (Array.isArray(doctor)) {
          res = await API.get("GetAllappointment", {
            params: {
              doctorIds: ids.join(","),
            },
          });
        } else {
          res = await API.get("GetAllappointment", {
            params: {
              doctorIds: ids,
            },
          });
        }
        console.log("lefuttam");
        setAppointments(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    GetAppointment();
  }, []);

  useEffect(() => {
    console.log(appointments);
  }, [appointments]);

  function mergSchedules(doctors) {
    if (!doctors) return null;
    if (Array.isArray(doctors) && doctors.length > 1) {
      const combined = {};
      doctors.forEach((doc) => {
        Object.entries(doc.schedule).forEach(([day, slots]) => {
          if (!combined[day]) combined[day] = [];
          slots.forEach((slot) => {
            if (!combined[day].some((s) => s.time === slot.time)) {
              combined[day].push({ time: slot.time, reason: slot.reason });
            }
          });
        });
      });
      return combined;
    }
    if (!Array.isArray(doctors)) {
      const days = Object.keys(doctors.schedule);
      const hours = doctors.schedule[days[0]].map((slot) => slot.time);
      const reason = hours.map((_, i) =>
        days.map((day) => doctor.schedule[day][i]?.reason || "")
      );

      return { days, hours, reason };
    }
    return null;
  }
  function getDayslots(day) {
    if (Array.isArray(schedulesData)) {
      const found = schedulesData.find((D) => Array.isArray(D) && D[0] == day);
      return found ? found[1] : [];
    }
    return schedulesData[day] || schedulesData.reason || [];
  }

  const schedulesData = mergSchedules(doctor);
  if (!schedulesData) return null;
  //console.log(schedulesData);
  const days = Array.isArray(doctor)
    ? Object.keys(schedulesData)
    : schedulesData.days;
  const hours = Array.isArray(doctor)
    ? Object.entries(schedulesData)[0][1].map((slot) => slot.time)
    : schedulesData.hours;

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
        <button onClick={handleClickForward} className="px-10">
          <StepForward />
        </button>
      </div>

      <table className="border-collapse border border-gray-400 w-full text-center">
        <thead>
          <tr>
            <th className="border bg-white border-gray-400 px-2 py-1"></th>
            {days.map((day, i) => (
              <th
                key={i}
                className="border-x-2 border-gray-400 bg-white px-2 py-1"
              >
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
                const Shuffleslots = getDayslots(day);
                const slot = Array.isArray(Shuffleslots[i])
                  ? { reason: Shuffleslots[i][j] || "" }
                  : Shuffleslots[i] || [];
                return (
                  <td
                    key={j}
                    className={`border-2 border-gray-400 px-2 py-1 text-white ${
                      slot.reason ? "bg-blue-800" : "bg-green-200"
                    }`}
                    style={handleReasons(slot.reason)}
                  >
                    {slot.reason ? slot.reason : ""}
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
