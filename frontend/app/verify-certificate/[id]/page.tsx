"use client";
import React, { useEffect, useState } from "react";
import Heading from "../../utils/Heading";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useVerifyCertificateQuery } from "@/redux/features/certificate/certificateApi";

const VerifyCertificatePage = ({ params }: any) => {
  const { id } = params;
  const { data, isLoading, error } = useVerifyCertificateQuery(id);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Heading
        title={`Verify Certificate ${id} - LMS`}
        description="Public Certificate Verification Page"
        keywords="Certificate, Verification, LMS"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Certificate Verification
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Verify the authenticity of a certificate issued by our platform.
            </p>
          </div>

          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-10 h-10 border-4 border-[#37a39a] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Invalid Certificate
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>
                        We could not find a valid certificate matching the ID <span className="font-bold">{id}</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : data?.data ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
                <div className="bg-green-500 dark:bg-green-600 px-4 py-3 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-white tracking-wide uppercase">Verified Authentic</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">Certificate ID</p>
                    <p className="text-xl font-mono text-gray-900 dark:text-white mt-1">{data.data.certificateId}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">Student Name</p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{data.data.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">Issue Date</p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                        {new Date(data.data.issuedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">Course Name</p>
                    <p className="text-xl font-bold text-[#37a39a] mt-1">{data.data.courseName}</p>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">Instructor</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{data.data.teacherName}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="font-medium text-[#37a39a] hover:text-[#2d877e]"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VerifyCertificatePage;
