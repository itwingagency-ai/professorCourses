import React, { FC, useEffect, useState } from "react";
import { useGetMyCertificatesQuery } from "@/redux/features/certificate/certificateApi";
import Link from "next/link";
import { format } from "timeago.js";
import { useSelector } from "react-redux";

type Props = {
  courseId: string;
  progressPercentage: number;
  isCertificateEnabled: boolean;
};

const CourseCertificate: FC<Props> = ({ courseId, progressPercentage, isCertificateEnabled }) => {
  const { data, isLoading, refetch } = useGetMyCertificatesQuery();
  const [cert, setCert] = useState<any>(null);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (data?.certificates) {
      const found = data.certificates.find((c: any) => c.courseId._id === courseId || c.courseId === courseId);
      setCert(found);
    }
  }, [data, courseId]);

  if (!isCertificateEnabled) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-[#ffffff1d]">
        This course does not offer a certificate of completion.
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-5 text-center text-gray-500">Checking certificate status...</div>;
  }

  if (progressPercentage < 100 && !cert) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-[#ffffff1d]">
        <h3 className="text-xl font-bold text-black dark:text-white mb-2">Certificate Locked</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          You must complete all lessons in this course to earn your certificate. Your current progress is {progressPercentage}%.
        </p>
        <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <div className="bg-[#37a39a] h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
    );
  }

  if (cert && cert.status === 'revoked') {
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Certificate Revoked</h3>
        <p className="text-red-500 mb-6 max-w-md mx-auto">
          This certificate is no longer valid. If you believe this is an error, please contact support.
        </p>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-[#ffffff1d]">
        <h3 className="text-xl font-bold text-black dark:text-white mb-2">Course Completed!</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Congratulations on completing the course! Your certificate is being generated. If it doesn't appear shortly, please refresh the page.
        </p>
        <button onClick={() => refetch()} className="px-6 py-2 border border-[#37a39a] text-[#37a39a] rounded-lg font-semibold hover:bg-[#37a39a]/10 transition">
          Refresh Status
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 text-center bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col items-center">
      
      {/* Certificate Card */}
      <div 
        id="certificate-card" 
        className="relative w-full max-w-4xl mx-auto bg-white p-12 border-[8px] border-double border-gray-300 shadow-2xl mb-8 print:shadow-none print:border-none print:w-[100vw] print:h-[100vh] print:m-0 print:p-8"
        style={{ color: "black", aspectRatio: "1.414/1" }}
      >
        <div className="absolute inset-0 m-4 border-2 border-dashed border-gray-200 z-0"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-[#37a39a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 tracking-wider">
            CERTIFICATE OF COMPLETION
          </h1>
          
          <p className="text-lg text-gray-500 italic mt-6">
            This certifies that
          </p>
          
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 px-12 inline-block">
            {user?.name || "Student"}
          </h2>
          
          <p className="text-lg text-gray-500 italic">
            has successfully completed the course
          </p>
          
          <h3 className="text-2xl font-bold text-[#37a39a] max-w-2xl mx-auto">
            {cert.courseId?.name || "Course Name"}
          </h3>
          
          <div className="flex justify-between w-full max-w-2xl mx-auto mt-12 pt-8">
            <div className="text-center">
              <p className="text-md font-semibold border-b border-black pb-1 mb-1 px-4">
                {format(cert.issuedAt)}
              </p>
              <p className="text-sm text-gray-500 uppercase tracking-widest">Date</p>
            </div>
            
            <div className="text-center">
              <p className="text-md font-semibold border-b border-black pb-1 mb-1 px-8">
                {cert.courseId?.teacherId?.name || "Instructor"}
              </p>
              <p className="text-sm text-gray-500 uppercase tracking-widest">Instructor</p>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-12 text-left">
            <p className="text-xs text-gray-400">ID: {cert.certificateId}</p>
            <p className="text-xs text-gray-400">Verify at: {typeof window !== 'undefined' ? window.location.origin : ""}/verify-certificate/{cert.certificateId}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 print:hidden">
        <Link 
          href={`/verify-certificate/${cert.certificateId}`} 
          target="_blank" 
          className="px-6 py-3 border border-[#37a39a] text-[#37a39a] rounded-lg font-semibold hover:bg-[#37a39a]/10 transition"
        >
          View Public Link
        </Link>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') window.print();
          }}
          className="px-8 py-3 bg-[#37a39a] text-white rounded-lg font-semibold hover:opacity-90 shadow-lg shadow-[#37a39a]/30 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Download / Print
        </button>
      </div>
    </div>
  );
};

export default CourseCertificate;
