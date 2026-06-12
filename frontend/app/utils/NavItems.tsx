/* eslint-disable react/jsx-key */
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navItemsData = [
  { name: "Home", url: "/" },
  { name: "Courses", url: "/courses" },
  { name: "About", url: "/about" },
  { name: "Policy", url: "/policy" },
  { name: "FAQ", url: "/faq" },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  const pathname = usePathname();

  const isActive = (url: string, index: number) => {
    if (url === "/") return pathname === "/" || activeItem === index;
    return pathname?.startsWith(url) || activeItem === index;
  };

  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden 800px:flex items-center">
        {navItemsData.map((item, index) => (
          <Link href={item.url} key={item.url} passHref>
            <span
              className={`relative text-[15px] px-5 py-2 font-Inter font-[500] cursor-pointer transition-colors duration-200 group
                ${isActive(item.url, index)
                  ? "text-primary dark:text-primary"
                  : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                }`}
            >
              {item.name}
              {/* Active underline indicator */}
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-primary transition-all duration-300
                  ${isActive(item.url, index) ? "w-4/5" : "w-0 group-hover:w-4/5"}`}
              />
            </span>
          </Link>
        ))}
      </div>

      {/* Mobile Nav */}
      {isMobile && (
        <div className="800px:hidden w-full">
          <div className="px-6 py-8 border-b border-gray-100 dark:border-white/10">
            <Link href="/" passHref>
              <span className="text-[22px] font-Outfit font-[700] bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                3S Consultant
              </span>
            </Link>
          </div>

          <nav className="flex flex-col py-2">
            {navItemsData.map((item, index) => (
              <Link href={item.url} key={item.url} passHref>
                <span
                  className={`flex items-center gap-3 py-4 px-6 text-[16px] font-Inter font-[500] cursor-pointer transition-colors duration-200 border-l-3
                    ${isActive(item.url, index)
                      ? "text-primary bg-primary/5 border-l-[3px] border-primary"
                      : "text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-primary/5 border-l-[3px] border-transparent"
                    }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default NavItems;