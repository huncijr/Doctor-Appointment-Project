import Navbar from "../Components/Navbar.jsx";
import guest from "../other pics/guest.png";
import welcome from "../other pics/welcome.png";
import Mangender from "../other pics/Man.webp";
import Womangender from "../other pics/Woman.webp";
import {
  Label,
  Radio,
  TextInput,
  Button,
  ToggleSwitch,
  Toast,
  ToastToggle,
} from "flowbite-react";
import {
  Eye,
  EyeClosed,
  CheckCheck,
  Trash2,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { API } from "../Context/AppointmentAPI.js";
import { useAuth } from "../Context/CheckAuth.jsx";
import { useCookie } from "../Context/Cookies.jsx";
import { Link } from "react-router-dom";
const LoginPage = () => {
  const { user, setUser } = useAuth();
  const { cookies, declineCookies } = useCookie();
  const [fullname, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");

  const [loginusername, setLoginUserName] = useState("");
  const [loginpassword, setLoginPassword] = useState("");

  const [ispassword, setIsPassword] = useState(false);
  const [isrepeatpassword, setRepeatPassword] = useState(false);
  const [switch1, setSwitch1] = useState(false);
  const [showtoast, setShowToast] = useState(false);
  const [option, setOption] = useState("");

  function handleispassword() {
    setIsPassword(!ispassword);
  }
  function handleisrepeatpassword() {
    setRepeatPassword(!isrepeatpassword);
  }

  const handleFullname = (fullname) => {
    fullname = fullname.trim();
    const hasInvalidChars = /[^a-zA-Z\s]/.test(fullname);
    if (hasInvalidChars) {
      toast.error("Full name can only contain letters and spaces");
      return false;
    }
    if (fullname.length > 20) {
      toast.error(
        "Only your first 2 name is enough (or shorter version of the name)"
      );
      return false;
    }

    const words = fullname.split(" ").filter(Boolean);

    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );

    const result = capitalizedWords.join(" ");
    return result;
  };

  const handleAge = (age) => {
    if (age < 14 || age > 100) {
      toast("the age registration is between 14-99!", {
        icon: "ℹ️",
      });
      return false;
    }
    return age;
  };

  const handleUserName = (user) => {
    user = user.trim().toLowerCase();
    if (user.length < 6) {
      toast("username is too short", {
        icon: "⚠️",
      });
      return false;
    }
    if (user.length > 12) {
      toast("username is too long", {
        icon: "⚠️",
      });

      return false;
    }
    if (user.includes(" ")) {
      toast("username has to be written in one word", {
        icon: "⚠️",
      });
    }
    return user;
  };
  const handlePassword = (password) => {
    password = password.trim();
    const numbers = password.match(/\d/g) || [];
    if (password.length < 5) {
      toast.error("password length must be min 5");
      return false;
    }
    if (password.length > 15) {
      toast.error("password length cant be more than 15");
      return false;
    }
    if (numbers.length < 2) {
      toast.error("password must contain min 2 numbers");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("password must contain min 1 uppercase letter");
      return false;
    }
    return password;
  };
  const handleRepeatPassword = (password, confirmpassword) => {
    if (confirmpassword != password) {
      toast.error("the passwords doesnt match");
      return false;
    }
    return true;
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const processedFullname = handleFullname(fullname);
    if (!processedFullname) return;
    const validAge = handleAge(age);
    if (!validAge) return;
    const validUser = handleUserName(username);
    if (!validUser) return;
    const validPassword = handlePassword(password);
    if (!validPassword) return;
    if (!handleRepeatPassword(password, confirmpassword)) return;
    try {
      let response = await API.post(
        "/Signup",
        {
          fullname: processedFullname,
          age: validAge,
          username: validUser,
          password: validPassword,
          gender: gender,
          registered: true,
          cookies,
        },
        {
          withCredentials: true,
        }
      );
      if (!cookies) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      setUser(response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("User name is already taken!");
      } else {
        console.error(error);
      }
    }
  };
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (!loginpassword.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (!loginusername.trim()) {
      toast.error("Password is required");
      return false;
    }
    try {
      let response = await API.post(
        "/Login",
        {
          username: loginusername,
          password: loginpassword,
          cookies,
        },
        {
          withCredentials: true,
        }
      );

      if (!cookies) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      setUser(response.data);
      console.log(user);
      toast.success(`Welcome ${response.data.fullname}`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Fullname or password is incorrect");
      } else {
        console.error(error);
      }
    }
  };
  const handleDelete = async () => {
    try {
      let userdelete = await API.delete(`/delete/${user._id}`, {
        withCredentials: true,
      });
      localStorage.removeItem("user");
      declineCookies();
      setUser(null);
      setFullName("");
      setAge("");
      setUserName("");
      setPassword("");
      setConfirmPassword("");
      setGender("");
      setLoginUserName("");
      setLoginPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      if (cookies) {
        await API.post("SignOut", {});
      } else {
        localStorage.removeItem("user");
      }
      setUser(null);
      setLoginUserName("");
      setLoginPassword("");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (showtoast) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showtoast]);
  const handleoption = (e, value) => {
    e.preventDefault();
    setOption(value);
    setShowToast(false);
  };
  return (
    <div className="relative flex flex-col items-center z-10 ">
      <Navbar />
      <div className="mt-10">
        <h2
          className=" px-5  py-10 sm:py-5 border-x-2 text-2xl md:text-3xl
             text-secondary border-secondary"
        >
          {user ? "WELCOME" : "MAKE AN ACCOUNT"}
        </h2>
      </div>
      <div className="flex flex-col sm:flex-row items-center min-h-screen justify-evenly w-full gap-5 sm:gap-2">
        {!user && (
          <img
            src={guest}
            alt="guest picture"
            className="h-[30%] w-[30%] sm:h-[25%] sm:w-[25%] rounded-full border-2 p-1"
          />
        )}
        <div
          className={`border-2  w-[90%] sm:w-full flex-[.5]  ${
            switch1 ? "bg-white/80 " : ""
          }`}
        >
          <div className="flex justify-end relative top-2 right-2">
            <ToggleSwitch
              checked={switch1}
              onChange={setSwitch1}
              className="bg-base"
            />
          </div>
          {!user ? (
            !switch1 ? (
              <div className="flex flex-col ">
                <span className="Lora font-bold py-2 text-center text-white text tracking-wider  text-2xl sm:text-3xl md:text-3xl lg:text-4xl">
                  Sign up for free!
                </span>
                <div className="text-lg px-4 py-3 ">
                  <form onSubmit={(e) => handleSubmitRegister(e)}>
                    <div className="flex justify-between ">
                      <div className="flex flex-col mr-10">
                        <div>
                          {" "}
                          <Label>Full name</Label>
                        </div>
                        <TextInput
                          type="text"
                          required
                          value={fullname}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      <div>
                        <div>
                          {" "}
                          <Label>Age</Label>
                        </div>
                        <TextInput
                          type="number"
                          className="w-[40%]"
                          value={age}
                          required
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        {" "}
                        <Label>Username</Label>
                      </div>
                      <TextInput
                        type="text"
                        className="w-[50%]"
                        addon="#"
                        required
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label>Your password</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <TextInput
                          className="w-[50%]"
                          type={ispassword ? "text" : "password"}
                          required
                          value={password}
                          shadow
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div
                          onClick={handleispassword}
                          className="text-secondary"
                        >
                          {ispassword ? <Eye /> : <EyeClosed />}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label>Repeat password</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <TextInput
                          className="w-[50%]"
                          type={isrepeatpassword ? "text " : "password"}
                          value={confirmpassword}
                          required
                          shadow
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <div
                          onClick={handleisrepeatpassword}
                          className="text-secondary"
                        >
                          {isrepeatpassword ? <Eye /> : <EyeClosed />}
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-5 ">
                      <Label className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                        {" "}
                        Choose your gender
                      </Label>
                      <div className="mt-4 px-10 flex justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Radio
                            name="Genders"
                            value="Men"
                            required
                            onChange={() => setGender("Men")}
                          />
                          <Label>Men</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Radio
                            name="Genders"
                            value="Woman"
                            onChange={() => setGender("Women")}
                          />
                          <Label>Woman</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Radio
                            name="Genders"
                            value="Other"
                            onChange={() => setGender("Other")}
                          />
                          <Label>Other</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex mt-3 justify-end">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white hover:bg-gradient-to-br focus:ring-teal-300 dark:focus:ring-teal-800"
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="Lora font-bold py-2 text-center text-primary text tracking-wider  text-2xl sm:text-3xl md:text-3xl lg:text-4xl">
                  Log in!
                </span>
                <div className="text-lg px-4 py-3">
                  <form onSubmit={(e) => handleSubmitLogin(e)}>
                    <div>
                      <div>
                        {" "}
                        <span className="text-primary font-bold">Username</span>
                      </div>
                      <TextInput
                        type="text"
                        className="w-[88%]"
                        value={loginusername}
                        onChange={(e) => setLoginUserName(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <span className="text-primary font-bold">Password</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TextInput
                          type={ispassword ? "text" : "password"}
                          required
                          shadow
                          value={loginpassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <div
                          onClick={handleispassword}
                          className="text-primary"
                        >
                          {ispassword ? <Eye /> : <EyeClosed />}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        color="dark"
                        className="mt-5 w-fit "
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col relative ">
              <h1
                className={`text-center mt-2  font-bold  ${
                  switch1 ? "text-primary" : "text-white"
                } text-lg sm:text-xl md:text-2xl lg:text-3xl`}
              >
                YOUR LOGGED IN AS
              </h1>
              <div className="text-center py-2">
                <img src={welcome} alt="welcome" />
                <div className="flex flex-col ">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl  text-red-800 font-bold changa-one tracking-widest ">
                    {" "}
                    {`${user.fullname}`}
                  </span>{" "}
                  <span
                    className={`${
                      switch1 ? "text-black/70" : "text-white/70"
                    } flex justify-end px-5 `}
                  >
                    {user.username}
                  </span>
                  <div className="px-2 flex justify-end items-end">
                    {user.gender === "Men" ? (
                      <img src={Mangender} className="h-6 w-5" />
                    ) : user.gender === "Women" ? (
                      <img src={Womangender} className="h-6 w-5" />
                    ) : null}
                  </div>
                </div>
                <div className="py-5 flex justify-center items-center ">
                  <CheckCheck className=" animate-pulse min-h-10 min-w-12 sm:min-h-14 sm:min-w-14 md:min-h-16 md:min-w-16 lg:min-h-18 lg:min-w-18  text-green-700 border-2 rounded-full bg-green-500" />
                </div>
                <div className="flex justify-evenly">
                  <Link to="/home">
                    <Button color="dark" outline>
                      {" "}
                      Get appointment
                    </Button>
                  </Link>
                  {showtoast && (
                    <Toast>
                      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-hidden">
                        <div className="mt-10 w-[90%] sm:w-[400px] rounded-lg shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700">
                          <div className="flex items-center gap-3 p-4">
                            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-500 dark:bg-cyan-900 dark:text-cyan-300">
                              <ShieldAlert className="h-6 w-6" />
                            </div>

                            <div className="flex-1 text-sm text-gray-100">
                              <span className="block text-base font-semibold text-white">
                                Are you sure about deleting your account?
                              </span>
                              <span className="block text-sm text-gray-300 mb-2">
                                Your account will be permanently deleted.
                              </span>

                              <div className="flex justify-end gap-2 mt-2">
                                <Button
                                  size="xs"
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  onClick={(e) => {
                                    handleoption(e, "Yes"), handleDelete();
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  size="xs"
                                  color="light"
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                                  onClick={(e) => handleoption(e, "No")}
                                >
                                  No
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Toast>
                  )}
                  <Button
                    color="red"
                    pill
                    className="gap-1"
                    onClick={() => setShowToast(true)}
                  >
                    <Trash2 />
                    Delete Account
                  </Button>
                </div>
                <div className="flex justify-center items-center py-3">
                  <Button
                    size="md"
                    className={switch1 ? "bg-primary" : "bg-secondary/30"}
                    onClick={handleLogOut}
                  >
                    <LogOut className="mr-2" /> Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
