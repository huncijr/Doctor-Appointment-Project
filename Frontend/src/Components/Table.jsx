import { StepBack, StepForward } from "lucide-react";
import { useEffect, useState } from "react";
import { API } from "../Context/AppointmentAPI";

const AppointmentTable = ({ doctor }) => {
  if (!doctor) return null;
  const [appointments, setAppointments] = useState(null);
  const [fadeinright, setFadeInRight] = useState(true);
  const [fadeinleft, setFadeInLeft] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [merged, setMerged] = useState({});
  const [days, setDays] = useState([]);
  const [hours, setHours] = useState([]);

  const [weekdays, setWeekdays] = useState(() => {
    let date = formatDate(new Date());
    return date;
  });

  const [oldweeks, setOldweeks] = useState(() => {
    let today = new Date();
    const date = new Date(today);
    date.setDate(date.getDate() - 7);
    let newdate = formatDate(date);
    console.log(newdate);
    return newdate;
  });

  const [appearweekdays, setAppearWeekDays] = useState(() => {
    let firstweek = getWeekDays(weekdays);
    return firstweek;
  });
  const [weekappointments, setWeekAppointments] = useState([]);

  let schedulesData;
  useEffect(() => {
    const GetAppointment = async () => {
      try {
        const ids = Array.isArray(doctor)
          ? doctor.map((d) => d._id).join(",")
          : doctor._id;

        const res = await API.get("GetAllappointment", {
          params: { doctorIds: ids || "" },
        });

        setAppointments(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    GetAppointment();
  }, []);
  const generateMergedSchedules = (doctor, appointments = []) => {
    schedulesData = mergeSchedules(doctor, appointments);
    if (!schedulesData || Object.keys(schedulesData).length === 0) return;
    setMerged(schedulesData);
    const dayKeys = Object.keys(schedulesData);
    setDays(dayKeys);

    if (dayKeys.length) {
      const hour = schedulesData[dayKeys[0]].map((s) => s.time);
      setHours(hour);
    }
    return schedulesData;
  };

  const generateWeekAppointments = (
    mergedData,
    weekdays,
    newappointments = []
  ) => {
    try {
      if (!mergedData || !weekdays) return;
      const updatedWeekAppointments = weekdays.map((day) => {
        const weekdayName = day.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const dayISO = day.toISOString().slice(0, 10);

        const baseSlots = mergedData[weekdayName] || [];
        const bookedAppointments = (newappointments || []).filter((appt) => {
          const apptISO =
            typeof appt.date === "string"
              ? appt.date.slice(0, 10)
              : new Date(appt.date).toISOString().slice(0, 10);
          return apptISO === dayISO;
        });

        const finalSlots = baseSlots.map((slot) => {
          const booked = (bookedAppointments || []).find(
            (a) => a.time === slot.time
          );

          if (booked) {
            const bookedISO =
              typeof booked.date === "string"
                ? booked.date.slice(0, 10)
                : new Date(booked.date).toISOString().slice(0, 10);

            return {
              ...slot,
              reason: booked.reason || "Reserved",
              date: bookedISO,
            };
          }
          if (slot.date) {
            const slotISO =
              typeof slot.date === "string"
                ? slot.date.slice(0, 10)
                : new Date(slot.date).toISOString().slice(0, 10);

            if (slotISO !== dayISO) {
              return {
                ...slot,
                reason: "",
                date: null,
              };
            }
          }

          return {
            ...slot,
            reason: slot.reason || "",
            date: slot.date || null,
          };
        });

        return {
          date: dayISO,
          day: weekdayName,
          slots: finalSlots,
        };
      });

      // console.log("setting weekAppointments", updatedWeekAppointments);
      setWeekAppointments(updatedWeekAppointments);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const mergedData = generateMergedSchedules(doctor, appointments);
    if (mergedData) {
      generateWeekAppointments(mergedData, appearweekdays, appointments);
    }
  }, [appointments, appearweekdays]);

  useEffect(() => {
    if (weekdays) {
      let appearweek = getWeekDays(weekdays);
      setAppearWeekDays(appearweek);
    }
  }, [weekdays]);

  function mergeSchedules(doctors, appointments = []) {
    if (!doctors) return null;
    let insidemerged = {};
    // console.log(appointments);

    const docs = Array.isArray(doctors) ? doctors : [doctors];

    docs.forEach((doc) => {
      if (!doc.schedule) return;

      Object.entries(doc.schedule).forEach(([day, slots]) => {
        if (!insidemerged[day]) insidemerged[day] = [];

        slots.forEach((slot) => {
          if (!insidemerged[day].some((s) => s.time === slot.time)) {
            insidemerged[day].push({
              time: slot.time,
              reason: slot.reason || "",
              date: slot.date || null,
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
        if (!insidemerged[day]) insidemerged[day] = [];

        const index = insidemerged[day].findIndex((s) => s.time === appt.time);
        if (index !== -1) {
          insidemerged[day][index].reason = appt.reason || "Reserved";
          insidemerged[day][index].date = appt.date;
        } else {
          insidemerged[day].push({
            time: appt.time,
            reason: appt.reason || "Reserved",
            date: appt.date,
          });
        }
      });
    }
    //console.log(insidemerged);
    return insidemerged;
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

  function handleDisabled() {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  }

  function handleClickForward(e, date) {
    e.preventDefault();
    setFadeInRight(true);
    setTimeout(() => setFadeInRight(null), 50);
    const nextweek = new Date(date);
    nextweek.setDate(nextweek.getDate() + 7);
    const handlenextweek = getWeekDays(nextweek);
    let formatnextweek = formatDate(nextweek);
    setWeekdays(formatnextweek);
    setAppearWeekDays(handlenextweek);
  }

  function handleClickBack(e, date) {
    e.preventDefault();
    setFadeInLeft(true);
    setTimeout(() => setFadeInLeft(null), 50);
    const lastweek = new Date(date);
    lastweek.setDate(lastweek.getDate() - 7);
    const handlelastweek = getWeekDays(lastweek);
    let formatlastweek = formatDate(lastweek);
    setWeekdays(formatlastweek);
    setAppearWeekDays(handlelastweek);
  }
  useEffect(() => {
    if (weekdays >= oldweeks) {
      console.log(oldweeks, "kisebb mint", weekdays);
    } else {
      console.log(oldweeks, "nagyobb mint", weekdays);
    }
  }, [weekdays, oldweeks]);

  return (
    <div
      className={`overflow-x-auto  bg-white border-2 border-secondary shadow-xl ${
        fadeinright ? "animate-fadeInRight" : ""
      }${fadeinleft ? "animate-fadeInLeft" : ""}`}
    >
      <div className="relative top-0 left-0 p-2 ">
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
      <div className="flex justify-between text-center items-center ">
        <button
          className="px-10"
          onClick={(e) => {
            handleClickBack(e, weekdays);
            handleDisabled();
          }}
          disabled={disabled}
        >
          <StepBack />
        </button>
        <h1 className="py-10 text-xl font-bold">THIS WEEK</h1>
        <button
          className="px-10"
          onClick={(e) => {
            handleClickForward(e, weekdays);
            handleDisabled();
          }}
          disabled={disabled}
        >
          <StepForward />
        </button>
      </div>
      <div
        className={`table-wrapper relative ${
          weekdays >= oldweeks ? "" : "past-week"
        }`}
      >
        <table className="border-collapse border border-gray-400 w-full text-center ">
          <thead>
            <tr>
              <th className="border bg-white border-gray-400 px-2 py-1"></th>
              {days &&
                days.map((day, i) => (
                  <th
                    key={i}
                    className="border bg-white border-gray-400 px-2 py-1"
                  >
                    {day}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {hours &&
              hours.map((hour, i) => (
                <tr key={i}>
                  <td className="border bg-white border-gray-400 px-2 py-1 font-medium">
                    {hour}
                  </td>

                  {weekappointments &&
                    weekappointments.map((day, j) => {
                      const slot = day.slots[i] || { reason: "" };

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
    </div>
  );
};

export default AppointmentTable;
