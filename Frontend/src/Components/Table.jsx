import { StepBack, StepForward } from "lucide-react";
import { useEffect } from "react";

const AppointmentTable = ({ doctor }) => {
  function mereSchedules(doctors) {
    if (doctor.length > 1) {
      const combined = {};
      doctor.forEach((doc) => {
        Object.entries(doc.schedule).forEach(([day, slots]) => {
          if (!combined[day]) combined[day] = [];
          slots.forEach((slot) => {
            if (!combined[day].some((s) => s.time === slot.time)) {
              combined[day].push({ time: slot.time, reason: slot.reason });
            }
          });
        });
        Object.keys(combined).forEach((day) => {
          combined[day].sort((a, b) => {
            combined[day].push(slot);
          });
        });
      });

      return combined;
    }
  }
  const days = Object.keys(doctor.schedule);
  const hours = doctor.schedule[days[0]].map((slot) => slot.time);
  mereSchedules(doctor);
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

  return (
    <div className="overflow-x-auto bg-white">
      <div className="flex justify-between text-center items-center">
        <span className="px-10">
          <StepBack />
        </span>
        <h1 className="py-10 text-xl font-bold">THIS WEEK</h1>
        <span className="px-10">
          <StepForward />
        </span>
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
                const slot = doctor.schedule[day][i];

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
