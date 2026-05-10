/* eslint-disable @typescript-eslint/no-require-imports */
"use client";
import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { FaGraduationCap, FaChalkboardTeacher, FaCertificate, FaHeadset, FaStar, FaUserGraduate } from "react-icons/fa";
import client1 from "../public/assests/client-1.jpg";
import client2 from "../public/assests/client-2.jpg";
import client3 from "../public/assests/client-3.jpg";

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  const { data, isLoading } = useGetAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const coursesData = Array.isArray(data) ? data : data.courses || data.course || data.data || [];
      // Get top 4 courses
      setCourses(coursesData.slice(0, 4));
    }
  }, [data]);

  return (
    <div>
      <Heading
        title="3S Consultant - Premium LMS"
        description="Your trusted partner for digital transformation and learning"
        keywords="Programming, MERN, Redux, Machine Learning, LMS"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      
      {/* Hero Section */}
      <Hero />

      {/* Stats Counter Section */}
      <section className="w-full bg-primary/5 py-12 border-y border-gray-200 dark:border-white/10">
        <div className="w-[90%] max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <FaUserGraduate className="text-primary text-4xl mb-3" />
            <h3 className="text-3xl font-Outfit font-bold text-gray-900 dark:text-white">500K+</h3>
            <p className="text-gray-600 dark:text-gray-300 font-Inter mt-1">Active Students</p>
          </div>
          <div className="flex flex-col items-center">
            <FaChalkboardTeacher className="text-primary text-4xl mb-3" />
            <h3 className="text-3xl font-Outfit font-bold text-gray-900 dark:text-white">100+</h3>
            <p className="text-gray-600 dark:text-gray-300 font-Inter mt-1">Expert Instructors</p>
          </div>
          <div className="flex flex-col items-center">
            <FaCertificate className="text-primary text-4xl mb-3" />
            <h3 className="text-3xl font-Outfit font-bold text-gray-900 dark:text-white">50+</h3>
            <p className="text-gray-600 dark:text-gray-300 font-Inter mt-1">Premium Courses</p>
          </div>
          <div className="flex flex-col items-center">
            <FaStar className="text-primary text-4xl mb-3" />
            <h3 className="text-3xl font-Outfit font-bold text-gray-900 dark:text-white">98%</h3>
            <p className="text-gray-600 dark:text-gray-300 font-Inter mt-1">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="w-[90%] max-w-[1400px] mx-auto py-20">
        <div className="text-center mb-12">
          <span className="text-primary font-Inter font-semibold uppercase tracking-wider">Top Rated Learning</span>
          <h2 className="text-3xl md:text-5xl font-Outfit font-bold text-gray-900 dark:text-white mt-2 mb-4">
            Explore Our Featured Courses
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-Inter max-w-[600px] mx-auto">
            Discover our most popular courses and start your journey towards mastering a new skill today.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl h-[350px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.length > 0 ? (
              courses.map((course: any, index: number) => {
                const thumbnail = course?.thumbnail?.url || course?.thumbnail?.secure_url || course?.thumbnail || "/assests/banner-img-1.png";
                return (
                  <Link href={`/course/${course._id || course.id}`} key={index} className="group flex flex-col glass rounded-xl overflow-hidden hover:-translate-y-2 transition duration-300 hover:shadow-xl hover:shadow-primary/10">
                    <div className="relative h-48 w-full overflow-hidden">
                      <img src={thumbnail} alt={course.name || course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {course.category || "General"}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md">{course.level || "Beginner"}</span>
                        <div className="flex items-center space-x-1">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">{course.ratings || 4.5}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white font-Poppins mb-2 line-clamp-2">{course.name || course.title}</h3>
                      <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5">
                        <span className="text-xl font-bold text-primary">${course.price || 0}</span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">View Details →</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">No courses available at the moment. Run the seed script to populate data.</p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/courses" className="inline-block px-8 py-3 bg-primary hover:bg-primaryDark text-white font-semibold rounded-lg transition-colors shadow-lg shadow-primary/30">
            View All Courses
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full bg-white dark:bg-darkBg py-20 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full filter blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="w-[90%] max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-Outfit font-bold text-gray-900 dark:text-white mb-4">
              Why Learn With Us?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-Inter max-w-[600px] mx-auto">
              We provide the best learning environment with premium resources to help you achieve your goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-2xl flex flex-col items-center text-center hover:bg-primary/5 transition-colors duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FaGraduationCap className="text-primary text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Poppins mb-3">Expert-Led Curriculum</h3>
              <p className="text-gray-600 dark:text-gray-300 font-Inter">
                Learn from industry experts with years of real-world experience and deep domain knowledge.
              </p>
            </div>
            
            <div className="glass p-8 rounded-2xl flex flex-col items-center text-center hover:bg-primary/5 transition-colors duration-300 transform md:-translate-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FaCertificate className="text-primary text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Poppins mb-3">Recognized Certificates</h3>
              <p className="text-gray-600 dark:text-gray-300 font-Inter">
                Earn certificates upon completion to showcase your new skills to potential employers.
              </p>
            </div>
            
            <div className="glass p-8 rounded-2xl flex flex-col items-center text-center hover:bg-primary/5 transition-colors duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FaHeadset className="text-primary text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Poppins mb-3">24/7 Dedicated Support</h3>
              <p className="text-gray-600 dark:text-gray-300 font-Inter">
                Get your questions answered anytime through our interactive Q&A sections and community forums.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="w-[90%] max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-Outfit font-bold text-gray-900 dark:text-white mb-4">
              Student Success Stories
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-Inter max-w-[600px] mx-auto">
              Don't just take our word for it. Here's what our students have to say about their learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-darkBg p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 relative">
              <div className="flex space-x-1 text-yellow-400 mb-4">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-Inter mb-6 italic">
                "The React & Node course completely transformed my career. Within 3 months of completing it, I landed a junior developer role at a tech startup!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                  <Image src={client1} alt="Student" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white font-Poppins">Sarah Jenkins</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Software Developer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-darkBg p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 relative">
              <div className="flex space-x-1 text-yellow-400 mb-4">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-Inter mb-6 italic">
                "The instructors here explain complex concepts with such clarity. The UI/UX masterclass gave me the confidence to take on freelance design clients."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                  <Image src={client2} alt="Student" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white font-Poppins">Michael Chen</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Freelance Designer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-darkBg p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 relative">
              <div className="flex space-x-1 text-yellow-400 mb-4">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-Inter mb-6 italic">
                "I appreciated the hands-on approach. The Data Science course didn't just teach theory, it forced me to build an actual portfolio of projects."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                  <Image src={client3} alt="Student" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white font-Poppins">Emily Brown</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data Analyst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-[90%] max-w-[1200px] mx-auto py-20">
        <div className="rounded-3xl overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-90 z-0"></div>
          {/* Add a subtle pattern overlay if desired */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0 mix-blend-overlay"></div>
          
          <div className="relative z-10 px-6 py-16 md:py-20 md:px-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-Outfit font-bold text-white mb-4 leading-tight">
                Ready to accelerate your career?
              </h2>
              <p className="text-white/80 font-Inter text-lg max-w-xl mx-auto lg:mx-0">
                Join our community of passionate learners and start building your future today with our premium courses.
              </p>
            </div>
            <div className="lg:w-1/3 flex justify-center lg:justify-end">
              <Link href="/courses" className="inline-block px-8 py-4 bg-white text-primary hover:bg-gray-100 font-bold rounded-lg transition-transform transform hover:scale-105 shadow-xl text-lg w-full sm:w-auto text-center">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;