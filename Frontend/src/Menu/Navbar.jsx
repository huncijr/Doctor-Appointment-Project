const Navbar = () => {
  return (
    <header
      className="animate-fadeInRight mt-7 sm:mt-12
             flex flex-col sm:flex-row items-center justify-center gap-4  [&>*]:cursor-pointer
             [&>*]:border-y-2 [&>*]:transition-colors [&>*]:duration-500 
             [&>*]:text-white [&>*]:text-xl sm:[&>*]:text-2xl lg:[&>*]:text-3xl
             [&>*:hover]:text-secondary [&>*:hover]:border-secondary"
    >
      <h1>HOME</h1>
      <h1>APPOINTMENTS</h1>
      <h1>ABOUT ME</h1>
      <h1>MY ACCOUNT</h1>
    </header>
  );
};

export default Navbar;
