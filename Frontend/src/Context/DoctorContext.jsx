import { createContext, useState, useContext, useEffect } from "react";

const DoctorContext = createContext();
export const DoctorProvider = ({ children }) => {
  const [selecteddoctor, setSelectedDoctor] = useState(() => {
    const saved = localStorage.getItem("Doctor");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (selecteddoctor) {
      localStorage.setItem("Doctor", JSON.stringify(selecteddoctor));
    }
  }, [selecteddoctor]);
  return (
    <DoctorContext.Provider value={{ selecteddoctor, setSelectedDoctor }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => useContext(DoctorContext);
