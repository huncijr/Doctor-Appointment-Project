import { useEffect, useState } from "react";
import { useCookie } from "../Context/Cookies.jsx";
import { Card, Button } from "flowbite-react";
const CookieUI = () => {
  const { cookies, acceptCookies, declineCookies } = useCookie();
  const [isopen, setOpen] = useState(true);
  useEffect(() => {
    if (cookies) setOpen(false);
  }, [cookies]);
  useEffect(() => {
    if (!cookies) {
      const interval = setInterval(() => {
        setOpen(true);
      }, 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [cookies]);
  if (!isopen && cookies) {
    return null;
  }
  function handleDecline() {
    declineCookies();
    setOpen(false);
  }
  return (
    <>
      {isopen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <Card className="animate-fadeInBottom  max-w-md mx-auto shadow-lg">
            <h5 className="mb-2 text-3xl font-bold text-secondary flex">
              {" "}
              Do you allow this site to use cookies?
            </h5>
            <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
              Cookies help us improve your experience by remembering your
              preferences, login , and visited pages. You can choose to accept
              or decline them — accepting cookies allows us to provide a more
              personalized and secure browsing experience.
            </p>
            <div className="flex justify-evenly gap-2">
              <Button
                className="flex-shrink-0 flex bg-secondary/30"
                onClick={acceptCookies}
              >
                Yes, I allow
              </Button>
              <Button
                color="dark"
                className="flex-shrink-0 flex"
                onClick={handleDecline}
              >
                No, i don't
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
export default CookieUI;
