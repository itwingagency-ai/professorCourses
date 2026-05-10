import React from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter as FaTwitterIcon, FaInstagram as FaInsta, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-darkBg border-t border-gray-200 dark:border-white/10 mt-20 transition-colors duration-300">
      <div className="w-[95%] 800px:w-[92%] max-w-[1400px] mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 1000px:gap-12">
          
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              className="text-[25px] font-Outfit font-[700] tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent"
            >
              3S Consultant
            </Link>
            <p className="mt-4 text-[15px] text-gray-600 dark:text-gray-300 font-Inter leading-relaxed">
              Empowering learners worldwide with premium educational content, expert guidance, and a supportive community to accelerate your career.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <FaTwitterIcon size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <FaInsta size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-Poppins mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/courses" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Courses</Link>
              </li>
              <li>
                <Link href="/about" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/faq" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-Poppins mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/policy" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policy" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/policy" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Refund Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-Poppins mb-4">Contact Info</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="text-base">Call Us: +1 (555) 123-4567</li>
              <li className="text-base">Email: support@3sconsultant.com</li>
              <li className="text-base">Address: 123 Learning Ave, Tech City, TC 10010</li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} 3S Consultant. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Powered by LMS Framework</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
