import React from "react";
import { FooterCopyright, FooterIcon } from "flowbite-react";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <div className="relative w-full text-white">
      <div className="flex justify-center items-center space-x-4 p-4">
        <FooterCopyright href="#" by="All rights reserved." year={2025} />
        <FooterIcon
          href="https://github.com/huncijr"
          target="_blank"
          icon={Github}
        />
      </div>
    </div>
  );
};

export default Footer;
