/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useRef, useState } from 'react';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { motion } from 'framer-motion'; // Import motion for animations
import { styles } from '../../../app/styles/style'; // Import styles
import { useSelector } from 'react-redux';
import { useActivationMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';

// Define the props type for the Verification component
type Props = {
  setRoute: (route: string) => void; // Function to set the route for navigation
  
}

// Define the type for the verification number state
type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
}

// Verification component
const Verification: FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: any) => state.auth); // Get the token from the auth state
  const [activation, { isSuccess, error, isLoading }] = useActivationMutation(); // Get the activation mutation from the auth API
  // State to track if there is an invalid input error
  const [invalidError, setInvalidError] = useState<boolean>(false);
  useEffect(() => {
    if (isSuccess) {
      toast.success("Account Activated Successfully");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
        setInvalidError(true);
      } else {
        if (process.env.NODE_ENV === "development") console.log('An error occured :', error);
      }
    }
  }, [isSuccess, error])

  // Refs for each input field to manage focus
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // State to hold the verification number input
  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    "0": "",
    "1": "",
    "2": "",
    "3": "",
  });

  // Handler for the verification button click
  const verificationHandler = async () => {
    //  setInvalidError(true); // Set error state if verification fails
    
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    })
  }

  // Function to handle input changes
  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false); // Reset error state on input change
    const newVerifyNumber = { ...verifyNumber, [index]: value }; // Update verification number state
    setVerifyNumber(newVerifyNumber);

    // Manage focus between input fields based on input value
    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus(); // Focus previous input if current is cleared
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus(); // Focus next input if current is filled
    }
  };

  // Function to handle pasting data into the input fields
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    const pastedData = event.clipboardData.getData('Text'); // Get pasted text

    // Check if the pasted data is 4 characters long
    if (pastedData.length === 4) {
      const newVerifyNumber = {
        "0": pastedData[0],
        "1": pastedData[1],
        "2": pastedData[2],
        "3": pastedData[3],
      };
      setVerifyNumber(newVerifyNumber); // Update verification number state with pasted values

      // Focus the last input after pasting
      inputRefs[3].current?.focus();
    }

    // Prevent the default paste behavior
    event.preventDefault();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900"> {/* Centering the content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} // Initial state for animation
        animate={{ opacity: 1, scale: 1 }} // Animate to this state
        transition={{ duration: 0.5 }} // Animation duration
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center"
      >
        <h1 className={`${styles.title}`}>
          Verify your Account
        </h1>
        <br />
        <p className="text-gray-600 dark:text-gray-300">A 4-digit OTP has been sent to your email.</p> {/* Message about OTP */}
        <br />
        <div className="w-full flex items-center justify-center mt-2">
          <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
            <VscWorkspaceTrusted size={40} /> {/* Icon for verification */}
          </div>
        </div>
        <br />
        <br />
        <div className="m-auto flex items-center justify-around">
          {Object.keys(verifyNumber).map((key, index) => (
            <input
              type="number" // Input type for numbers only
              key={key}
              ref={inputRefs[index]} // Reference for managing focus
              className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px ] font-Poppins outline-none text-center ${invalidError
                ? "shake border-red-500" // Add shake effect and red border on error
                : "dark:border-white border-[#0000004a]" // Default border styles
                }`}
              placeholder='' // No placeholder
              maxLength={1} // Limit input to a single character
              value={verifyNumber[key as keyof VerifyNumber]} // Bind input value to state
              onChange={(e) => handleInputChange(index, e.target.value)} // Handle input changes
              onPaste={(e) => handlePaste(e, index)} // Handle pasting data
            />
          ))}
        </div>
        <br />
        <br />
        <div className="flex justify-center">
        <button
            className={`${styles.button} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={verificationHandler}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify OTP'
            )}
          </button>
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[#0000004a] dark:text-white">
          Already have an account?  {" "}
          <span
            className="text-[#497DF2] cursor-pointer"
            onClick={() => setRoute('Login')} // Navigate to signin route
          >
            Sign in
          </span>
        </h5>
        {/* Optional: Add loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg" style={{ minWidth: '250px' }}> {/* Added minWidth */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
                <p className="text-black dark:text-white whitespace-nowrap"> Validating your OTP...</p> {/* Added whitespace-nowrap */}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Verification;