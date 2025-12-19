import { X, Check, User, Timer, CalendarRange, BadgeCheck } from "lucide-react";
import { Pagination, Badge } from "flowbite-react";

const AppointmentCard = ({ appointment, onDelete, onComplete, handleDay }) => {
  const {
    _id,
    fullname,
    date,
    message,
    age,
    reason,
    time,
    doctorname,
    isRemoving,
  } = appointment;

  return (
    <div
      className={`relative border-2 bg-white rounded-lg shadow-xl 
      flex flex-col justify-between h-[400px] p-3 cursor-pointer
      overflow-y-auto card
      ${isRemoving ? "removing" : ""}`}
    >
      <div className="absolute right-2 top-2 flex gap-2">
        <button
          className="rounded-full bg-red-700 p-3 hover:bg-red-500"
          onClick={() => onDelete(_id)}
        >
          <X className="text-white" />
        </button>
        <button
          className="rounded-full bg-green-700 p-3 hover:bg-green-500"
          onClick={() => onComplete(_id)}
        >
          <Check className="text-white" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="lora font-bold tracking-wider">{fullname}</span>
        <span className="font-bold lora">{date}</span>

        <hr className="w-full border-2 border-black" />

        <div className="flex w-full py-2 gap-2">
          <div className="flex-[.6] min-w-0 break-words">
            <span className="text-sm font-semibold">{message}</span>
            <span className="flex items-center gap-1">
              <User size={14} /> {age} years old
            </span>
          </div>

          <div className="flex-[.4]">
            <div className="flex flex-col gap-1">
              <Badge size="sm" className="truncate" icon={BadgeCheck}>
                {reason}
              </Badge>
              <Badge color="gray" size="sm" icon={Timer}>
                {time}
              </Badge>
              <Badge color="indigo" size="sm" icon={CalendarRange}>
                {handleDay(date)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-2">
        <hr className="w-full border-2 border-red-600 mb-2" />
        <span className="font-bold">{`Associated with ${doctorname}`}</span>
      </div>
    </div>
  );
};

export default AppointmentCard;
