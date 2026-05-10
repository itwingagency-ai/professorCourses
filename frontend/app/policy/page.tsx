"use client";

import React, { FC, useState } from "react";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { FaShieldAlt, FaFileContract, FaMoneyBillWave, FaCookieBite } from "react-icons/fa";

const PolicyPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [activeTab, setActiveTab] = useState("privacy");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-darkBg transition-colors duration-300">
      <Heading
        title="Policies & Terms - 3S Consultant"
        description="Platform policies, terms of service, and privacy information"
        keywords="policy, privacy, terms of service, refund policy, cookies, LMS"
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={3}
        setRoute={setRoute}
        route={route}
      />

      {/* Hero Section */}
      <section className="bg-primary/5 dark:bg-primary/10 py-16 text-center border-b border-gray-200 dark:border-white/10">
        <div className="w-[90%] max-w-[800px] mx-auto">
          <h1 className="text-4xl md:text-5xl font-Outfit font-bold text-gray-900 dark:text-white mb-4">
            Legal & Policies
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-Inter text-lg">
            We are committed to protecting your privacy and providing a transparent, secure learning environment.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: October 2023</p>
        </div>
      </section>

      <section className="w-[90%] max-w-[1200px] mx-auto py-12 flex-grow flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-1/4 md:sticky md:top-24 bg-white dark:bg-darkSurface border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-sm">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all font-Inter font-medium ${
                activeTab === "privacy"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              <FaShieldAlt className={activeTab === "privacy" ? "text-white" : "text-primary"} />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all font-Inter font-medium ${
                activeTab === "terms"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              <FaFileContract className={activeTab === "terms" ? "text-white" : "text-blue-500"} />
              <span>Terms of Service</span>
            </button>
            <button
              onClick={() => setActiveTab("refund")}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all font-Inter font-medium ${
                activeTab === "refund"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              <FaMoneyBillWave className={activeTab === "refund" ? "text-white" : "text-green-500"} />
              <span>Refund Policy</span>
            </button>
            <button
              onClick={() => setActiveTab("cookies")}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all font-Inter font-medium ${
                activeTab === "cookies"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              <FaCookieBite className={activeTab === "cookies" ? "text-white" : "text-orange-500"} />
              <span>Cookie Policy</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="w-full md:w-3/4 bg-white dark:bg-darkSurface border border-gray-200 dark:border-white/10 rounded-2xl p-8 md:p-12 shadow-sm min-h-[600px]">
          
          {/* Privacy Policy */}
          {activeTab === "privacy" && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-Outfit font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-white/10 pb-4">Privacy Policy</h2>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-300 font-Inter leading-relaxed">
                <p>
                  At 3S Consultant, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our learning platform.
                </p>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">1. Information We Collect</h3>
                <p>We collect information that you voluntarily provide to us when registering on the platform, expressing an interest in obtaining information about us or our products, or otherwise contacting us. This includes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Data:</strong> Name, email address, password, and profile picture.</li>
                  <li><strong>Payment Data:</strong> We process payments through Stripe. We do not store your credit card details on our servers.</li>
                  <li><strong>Usage Data:</strong> Information about your interactions with courses, video watch time, and quiz scores.</li>
                </ul>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">2. How We Use Your Information</h3>
                <p>We use personal information collected via our platform for a variety of business purposes described below:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To facilitate account creation and logon process.</li>
                  <li>To deliver the educational content you have purchased or enrolled in.</li>
                  <li>To send you administrative information, such as updates to terms, conditions, and policies.</li>
                  <li>To request feedback and contact you about your use of our platform.</li>
                </ul>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">3. Sharing Your Information</h3>
                <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell or rent your personal information to third parties.</p>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">4. Data Security</h3>
                <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
              </div>
            </div>
          )}

          {/* Terms of Service */}
          {activeTab === "terms" && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-Outfit font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-white/10 pb-4">Terms of Service</h2>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-300 font-Inter leading-relaxed">
                <p>
                  By accessing or using the 3S Consultant platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">1. Use License</h3>
                <p>Upon enrolling in a course, we grant you a limited, non-exclusive, non-transferable license to access and view the course content for which you have paid all required fees, solely for your personal, non-commercial, educational purposes.</p>
                <p>Under this license you may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Modify, copy, reproduce, or distribute the materials;</li>
                  <li>Use the materials for any commercial purpose, or for any public display;</li>
                  <li>Attempt to decompile or reverse engineer any software contained on the platform;</li>
                  <li>Remove any copyright or other proprietary notations from the materials; or</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ul>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">2. User Account Responsibilities</h3>
                <p>You are responsible for safeguarding the password that you use to access the platform and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">3. Code of Conduct</h3>
                <p>When participating in Q&A sections or course reviews, you agree to communicate respectfully. Harassment, hate speech, spam, and promotional content are strictly prohibited and may result in immediate account termination without refund.</p>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">4. Disclaimer</h3>
                <p>The materials on the 3S Consultant platform are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.</p>
              </div>
            </div>
          )}

          {/* Refund Policy */}
          {activeTab === "refund" && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-Outfit font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-white/10 pb-4">Refund Policy</h2>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-300 font-Inter leading-relaxed">
                <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg mb-6 text-gray-800 dark:text-gray-200">
                  <strong>The 30-Day Guarantee:</strong> We want you to be completely satisfied with your learning experience. That's why we offer a 30-day money-back guarantee for all individual course purchases.
                </div>

                <p>
                  If you are unhappy with a course, you can request a full refund within 30 days of your purchase date, subject to the conditions outlined below.
                </p>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">Conditions for a Refund</h3>
                <p>To prevent abuse of our refund policy and protect our instructors' intellectual property, refunds are subject to the following limitations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The refund request must be submitted within 30 days of the original purchase date.</li>
                  <li>You must not have consumed (watched/completed) more than 30% of the course content.</li>
                  <li>You must not have downloaded all or a significant portion of the course's offline resources (PDFs, source code).</li>
                  <li>You have not previously refunded the same course.</li>
                  <li>Your account is in good standing and not in violation of our Terms of Service.</li>
                </ul>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">How to Request a Refund</h3>
                <p>To request a refund, please send an email to <strong>billing@3sconsultant.com</strong> from the email address associated with your account. Include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your full name</li>
                  <li>The name of the course you wish to refund</li>
                  <li>A brief explanation of why the course didn't meet your expectations (this helps us improve!)</li>
                </ul>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">Processing Time</h3>
                <p>Once approved, refunds are processed immediately on our end. However, depending on your financial institution, it may take 5-10 business days for the funds to appear back on your original payment method.</p>
              </div>
            </div>
          )}

          {/* Cookie Policy */}
          {activeTab === "cookies" && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-Outfit font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-white/10 pb-4">Cookie Policy</h2>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-300 font-Inter leading-relaxed">
                <p>
                  This Cookie Policy explains how 3S Consultant uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                </p>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">What are cookies?</h3>
                <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">Types of Cookies We Use</h3>
                
                <div className="bg-gray-50 dark:bg-darkBg p-5 rounded-xl border border-gray-200 dark:border-white/5">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">1. Essential Cookies</h4>
                  <p className="text-sm">These cookies are strictly necessary to provide you with services available through our platform and to use some of its features, such as accessing secure areas (e.g., staying logged in securely via our authentication tokens).</p>
                </div>

                <div className="bg-gray-50 dark:bg-darkBg p-5 rounded-xl border border-gray-200 dark:border-white/5 mt-4">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">2. Performance and Functionality Cookies</h4>
                  <p className="text-sm">These cookies are used to enhance the performance and functionality of our platform but are non-essential to their use. However, without these cookies, certain functionality (like remembering your theme preference: dark vs. light mode) may become unavailable.</p>
                </div>

                <div className="bg-gray-50 dark:bg-darkBg p-5 rounded-xl border border-gray-200 dark:border-white/5 mt-4">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">3. Analytics and Customization Cookies</h4>
                  <p className="text-sm">These cookies collect information that is used either in aggregate form to help us understand how our platform is being used or how effective our marketing campaigns are, or to help us customize our platform for you.</p>
                </div>

                <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">How can I control cookies?</h3>
                <p>You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted (such as logging in securely).</p>
              </div>
            </div>
          )}

        </main>
      </section>
    </div>
  );
};

export default PolicyPage;
