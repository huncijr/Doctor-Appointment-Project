import Navbar from "../Components/Navbar.jsx";
import guest from "../other pics/guest.png";
import { Label, Radio, TextInput, Button, ToggleSwitch } from "flowbite-react";
import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const LoginPage = () => {
  const [fullname, setFullName] = useState("");
  const [age, setAge] = useState(null);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");

  const [ispassword, setIsPassword] = useState(false);
  const [isrepeatpassword, setRepeatPassword] = useState(false);
  const [switch1, setSwitch1] = useState(false);

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
      return;
    }
    if (fullname.length > 20) {
      toast.error(
        "Only your first 2 name is enough (or shorter version of the name)"
      );
      return;
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
      return;
    }
    return age;
  };

  const handleUserName = (user) => {
    user = user.trim().toLowerCase();
    if (user.length < 6) {
      toast("username is too short", {
        icon: "⚠️",
      });
      return;
    }
    if (user.length > 12) {
      toast("username is too long", {
        icon: "⚠️",
      });

      return;
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
      return;
    }
    if (password.length > 15) {
      toast.error("password length cant be more than 15");
      return;
    }
    if (numbers.length < 2) {
      toast.error("password must contain min 2 numbers");
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("password must contain min 1 uppercase letter");
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

  const handleSubmitLogin = (e) => {
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
  };
  return (
    <div className="relative flex flex-col items-center z-10 ">
      <Navbar />
      <div className="mt-10">
        <h2
          className=" px-5  py-10 sm:py-5 border-x-2 text-2xl md:text-3xl
             text-secondary border-secondary"
        >
          MAKE AN ACCOUNT
        </h2>
      </div>
      <div className="flex flex-col sm:flex-row items-center min-h-screen justify-evenly w-full gap-5 sm:gap-2">
        <img
          src={guest}
          alt="guest picture"
          className="h-[30%] w-[30%] sm:h-[25%] sm:w-[25%] rounded-full border-2 p-1"
        />

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
          {!switch1 ? (
            <div className="flex flex-col ">
              <span className="Lora font-bold py-2 text-center text-white text tracking-wider  text-2xl sm:text-3xl md:text-3xl lg:text-4xl">
                Sign up for free!
              </span>
              <div className="text-lg px-4 py-3 ">
                <form onSubmit={(e) => handleSubmitLogin(e)}>
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
                <form>
                  <div>
                    <div>
                      {" "}
                      <span className="text-primary font-bold">Username</span>
                    </div>
                    <TextInput type="text" className="w-[88%]" />
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
                      />
                      <div onClick={handleispassword} className="text-primary">
                        {ispassword ? <Eye /> : <EyeClosed />}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button color="dark" className="mt-5 w-fit ">
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
