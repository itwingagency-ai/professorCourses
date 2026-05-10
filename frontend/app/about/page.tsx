"use client";

import React, { FC, useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { FaGraduationCap, FaUsers, FaGlobeAmericas, FaAward, FaLightbulb, FaHeart, FaRocket, FaShieldAlt } from "react-icons/fa";

const AboutPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      bio: "Former lead developer at top tech firms, Alex founded 3S Consultant to make premium tech education accessible to everyone."
    },
    {
      name: "Maria Garcia",
      role: "Head of Content",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      bio: "With a PhD in Computer Science, Maria ensures our curriculum is both rigorous and easy to digest for beginners."
    },
    {
      name: "David Chen",
      role: "Lead Instructor (Web)",
      image: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      bio: "David brings 10+ years of full-stack experience to his highly-rated web development bootcamp courses."
    },
    {
      name: "Sarah Williams",
      role: "Lead Instructor (Data)",
      image: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
      bio: "A former data scientist at major finance firms, Sarah demystifies complex ML concepts for her students."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Heading
        title="About Us - 3S Consultant"
        description="Learn about our mission to democratize technology education."
        keywords="about, LMS, education, 3S Consultant, mission, team"
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={2}
        setRoute={setRoute}
        route={route}
      />

      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-gray-50 dark:bg-darkBg">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="w-[90%] max-w-[1200px] mx-auto relative z-10 text-center">
          <div className="inline-block px-4 py-2 rounded-full glass border border-primary/30 mb-6">
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-Inter font-semibold text-sm tracking-wider uppercase">
              Our Story
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-Outfit font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Tech Education</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-Inter max-w-3xl mx-auto leading-relaxed">
            We believe that high-quality technology education should be accessible to everyone, anywhere. 
            Our platform connects passionate learners with industry experts to bridge the global skills gap.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full bg-primary py-12">
        <div className="w-[90%] max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <FaUsers className="text-4xl mx-auto mb-3 opacity-80" />
            <h3 className="text-4xl font-Outfit font-bold mb-1">500K+</h3>
            <p className="font-Inter font-medium opacity-90">Global Students</p>
          </div>
          <div>
            <FaGraduationCap className="text-4xl mx-auto mb-3 opacity-80" />
            <h3 className="text-4xl font-Outfit font-bold mb-1">50+</h3>
            <p className="font-Inter font-medium opacity-90">Premium Courses</p>
          </div>
          <div>
            <FaGlobeAmericas className="text-4xl mx-auto mb-3 opacity-80" />
            <h3 className="text-4xl font-Outfit font-bold mb-1">120+</h3>
            <p className="font-Inter font-medium opacity-90">Countries Reached</p>
          </div>
          <div>
            <FaAward className="text-4xl mx-auto mb-3 opacity-80" />
            <h3 className="text-4xl font-Outfit font-bold mb-1">4.8/5</h3>
            <p className="font-Inter font-medium opacity-90">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-[90%] max-w-[1200px] mx-auto py-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-2xl filter blur-2xl transform rotate-3"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800 p-2">
               <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Students learning together" className="w-full h-auto rounded-xl object-cover aspect-[4/3]" />
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-Outfit font-bold text-gray-900 dark:text-white mb-6">
              Our Mission is Simple
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300 font-Inter text-lg leading-relaxed">
              <p>
                Founded in 2023, 3S Consultant began with a simple observation: traditional education isn't keeping up with the rapid pace of technological change, while quality bootcamps remain prohibitively expensive for many.
              </p>
              <p>
                We set out to build an alternative—a platform that offers the rigor and depth of an elite bootcamp at a fraction of the cost. By leveraging modern technology and a network of passionate industry professionals, we're making that vision a reality.
              </p>
              <p>
                Today, our curriculum covers the most in-demand skills, from full-stack web development to artificial intelligence, empowering individuals to transform their careers and lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="w-[90%] max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-Outfit font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-Inter max-w-2xl mx-auto">
              These principles guide everything we do, from course creation to platform design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-darkBg p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary text-2xl">
                <FaLightbulb />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Poppins mb-3">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-400 font-Inter">We constantly update our curriculum and platform to reflect the latest industry trends and technologies.</p>
            </div>
            
            <div className="bg-white dark:bg-darkBg p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 text-2xl">
                <FaShieldAlt />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Poppins mb-3">Quality First</h3>
              <p className="text-gray-600 dark:text-gray-400 font-Inter">We never compromise on the depth or accuracy of our educational content. Excellence is our standard.</p>
            </div>
            
            <div className="bg-white dark:bg-darkBg p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-6 text-red-500 text-2xl">
                <FaHeart />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Poppins mb-3">Community</h3>
              <p className="text-gray-600 dark:text-gray-400 font-Inter">Learning is better together. We foster a supportive, inclusive environment where students help one another.</p>
            </div>
            
            <div className="bg-white dark:bg-darkBg p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-6 text-green-500 text-2xl">
                <FaRocket />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Poppins mb-3">Accessibility</h3>
              <p className="text-gray-600 dark:text-gray-400 font-Inter">We strive to keep our platform affordable and user-friendly, removing barriers to entry for tech careers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="w-[90%] max-w-[1200px] mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-Outfit font-bold text-gray-900 dark:text-white mb-4">
            Meet the Experts
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-Inter max-w-2xl mx-auto">
            Our team consists of industry veterans passionate about sharing their knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-white dark:border-darkBg shadow-xl group-hover:scale-105 transition-transform duration-300">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Poppins mb-1">{member.name}</h3>
              <p className="text-primary font-Inter font-semibold mb-4">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-400 font-Inter text-sm px-4">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-[90%] max-w-[1000px] mx-auto mb-20">
        <div className="glass rounded-3xl p-10 md:p-16 text-center border border-primary/20 bg-gradient-to-b from-transparent to-primary/5">
          <h2 className="text-3xl font-Outfit font-bold text-gray-900 dark:text-white mb-4">
            Join Our Learning Community
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-Inter text-lg mb-8 max-w-2xl mx-auto">
            Start your journey today and gain the skills you need to build the future.
          </p>
          <a href="/courses" className="inline-block px-8 py-4 bg-primary hover:bg-primaryDark text-white font-bold rounded-lg transition-colors shadow-lg">
            Explore Our Courses
          </a>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
