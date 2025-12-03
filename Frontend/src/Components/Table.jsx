import { StepBack, StepForward } from "lucide-react";
import { useEffect, useState } from "react";
import { API } from "../Context/AppointmentAPI";

const AppointmentTable = ({ doctor }) => {
  const [appointments, setAppointments] = useState(null);
  const [weekdays, setWeekdays] = useState(() => {
    let date = formatDate(new Date());
    return date;
  });
  const [appearweekdays, setAppearWeekDays] = useState(null);

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
    if (weekdays) {
      let appearweek = getWeekDays(weekdays);
      setAppearWeekDays(appearweek);
    }
  }, [weekdays]);

  function mergeSchedules(doctors, appointments = []) {
    if (!doctors) return null;
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
        // console.log(day);
        if (!merged[day]) merged[day] = [];

        const index = merged[day].findIndex((s) => s.time === appt.time);
        if (index !== -1) {
          merged[day][index].reason = appt.reason || "Reserved";
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

  function getWeekDays(date = new Date()) {
    const current = new Date(date);
    let dayOfWeek = current.getDay();
    const monday = new Date(current);
    const toMonday = (dayOfWeek = dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
    monday.setDate(current.getDate() + toMonday);
    let days = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    //console.log(days);
    return days;
  }
  function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    let newdate = `${year}-${month}-${day}`;
    return newdate;
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
  function handleClickForward(e, date) {
    e.preventDefault();
    const nextweek = new Date(date);
    nextweek.setDate(nextweek.getDate() + 7);
    const handlenextweek = getWeekDays(nextweek);
    let formatnextweek = formatDate(nextweek);
    setWeekdays(formatnextweek);
    setAppearWeekDays(handlenextweek);
  }

  function handleClickBack(e, date) {
    e.preventDefault();
    const lastweek = new Date(date);
    lastweek.setDate(lastweek.getDate() - 7);

    const handlelastweek = getWeekDays(lastweek);
    let formatlastweek = formatDate(lastweek);
    console.log(`${handlelastweek} es ${formatlastweek}`);
    setWeekdays(formatlastweek);
    setAppearWeekDays(handlelastweek);
  }

  return (
    <div className="overflow-x-auto bg-white">
      <div className="relative top-0 left-0 p-2">
        <span className="italic changa-one tracking-wider sm:text-lg md:text-xl lg:text-2xl">
          {appearweekdays &&
            `${appearweekdays[0].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })} -
            ${appearweekdays[appearweekdays.length - 1].toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
              }
            )}`}
        </span>
      </div>
      <div className="flex justify-between text-center items-center">
        <button className="px-10" onClick={(e) => handleClickBack(e, weekdays)}>
          <StepBack />
        </button>
        <h1 className="py-10 text-xl font-bold">THIS WEEK</h1>
        <button
          className="px-10"
          onClick={(e) => handleClickForward(e, weekdays)}
        >
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
                    className={`border-2 border-black px-2 py-1 text-white ${
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
