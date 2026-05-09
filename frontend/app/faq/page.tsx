"use client";

import React, { FC, useState } from "react";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { FaChevronDown, FaChevronUp, FaSearch, FaEnvelope } from "react-icons/fa";

const faqData = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I create an account?",
        a: "Click on the 'Login' icon in the top right corner of the navigation bar, then select 'Sign Up'. Fill in your name, email address, and choose a secure password. You'll receive a verification code via email to complete your registration."
      },
      {
        q: "Is it free to sign up?",
        a: "Yes! Creating an account is completely free. We even offer several free introductory courses so you can experience our platform before committing to a paid course."
      },
      {
        q: "What do I need to take a course?",
        a: "All you need is a modern web browser (Chrome, Firefox, Safari, or Edge) and a stable internet connection. Most courses recommend having a text editor (like VS Code) installed for hands-on coding exercises."
      }
    ]
  },
  {
    category: "Courses & Learning",
    items: [
      {
        q: "Do I get lifetime access to the courses I purchase?",
        a: "Yes! Once you enroll in a paid course, you get lifetime access to all its content, including any future updates or additions to that specific course material."
      },
      {
        q: "Do you offer certificates of completion?",
        a: "Yes. Upon completing 100% of a course's lessons and assignments, you will automatically receive a digital Certificate of Completion that you can download or share directly to your LinkedIn profile."
      },
      {
        q: "Can I ask questions if I get stuck?",
        a: "Absolutely. Every lesson features a dedicated Q&A section where you can ask questions. Our instructors and community members are highly active and typically respond within 24 hours."
      },
      {
        q: "Are the videos downloadable for offline viewing?",
        a: "To protect our instructors' intellectual property, course videos cannot be downloaded directly. However, any supplementary resources (PDFs, source code, cheat sheets) are available for download."
      }
    ]
  },
  {
    category: "Account & Billing",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, MasterCard, American Express) processed securely via Stripe. In certain regions, we also support PayPal and Google/Apple Pay."
      },
      {
        q: "Do you offer a refund policy?",
        a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with a course for any reason, you can request a full refund within 30 days of purchase, provided you haven't completed more than 30% of the course."
      },
      {
        q: "How do I change my password or email?",
        a: "Navigate to your Profile page by clicking your avatar in the top right. From there, select 'Change Password' to update your credentials. To change your email, please contact support."
      }
    ]
  },
  {
    category: "Technical Support",
    items: [
      {
        q: "The videos are buffering or won't play. What should I do?",
        a: "First, try clearing your browser cache and cookies. Ensure you have a stable internet connection (minimum 5 Mbps recommended for HD video). If the issue persists, try accessing the platform from a different browser or network."
      },
      {
        q: "I didn't receive my verification email.",
        a: "Please check your spam or junk folder. If you still don't see it after 15 minutes, you can click 'Resend Code' on the verification screen. Ensure you entered your email address correctly."
      }
    ]
  }
];

const FAQPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const toggleAccordion = (index: string) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Filter logic
  const filteredData = faqData.map(category => {
    // If a specific category is selected, filter out others (unless "All" is selected)
    if (activeCategory !== "All" && category.category !== activeCategory) {
      return { ...category, items: [] };
    }

    // Filter items based on search query
    const filteredItems = category.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { ...category, items: filteredItems };
  }).filter(category => category.items.length > 0); // Remove empty categories

  return (
    <div className="min-h-screen flex flex-col">
      <Heading
        title="FAQ - 3S Consultant"
        description="Frequently asked questions about our learning platform"
        keywords="faq, help, support, LMS, questions"
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={4}
        setRoute={setRoute}
        route={route}
      />

      {/* Hero Section */}
      <section className="bg-primary/5 dark:bg-primary/10 py-16 text-center border-b border-gray-200 dark:border-white/10">
        <div className="w-[90%] max-w-[800px] mx-auto">
          <h1 className="text-4xl md:text-5xl font-Outfit font-bold text-gray-900 dark:text-white mb-6">
            How can we help you?
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkSurface text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-Inter text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="w-[90%] max-w-[1000px] mx-auto py-16 flex-grow">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-5 py-2 rounded-full font-Inter font-medium transition-colors ${
              activeCategory === "All" 
                ? "bg-primary text-white" 
                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
            }`}
          >
            All Questions
          </button>
          {faqData.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-5 py-2 rounded-full font-Inter font-medium transition-colors ${
                activeCategory === cat.category 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-8">
          {filteredData.length > 0 ? (
            filteredData.map((category, catIdx) => (
              <div key={catIdx} className="mb-8">
                <h2 className="text-2xl font-Outfit font-bold text-gray-900 dark:text-white mb-6 pl-2 border-l-4 border-primary">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.items.map((item, itemIdx) => {
                    const uniqueId = `${catIdx}-${itemIdx}`;
                    const isExpanded = expandedIndex === uniqueId;

                    return (
                      <div 
                        key={itemIdx} 
                        className={`border rounded-xl transition-all duration-300 ${
                          isExpanded 
                            ? "border-primary bg-white dark:bg-darkSurface shadow-md" 
                            : "border-gray-200 dark:border-white/10 bg-white dark:bg-darkBg hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                      >
                        <button
                          className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                          onClick={() => toggleAccordion(uniqueId)}
                        >
                          <span className={`text-lg font-Poppins font-medium ${isExpanded ? "text-primary" : "text-gray-900 dark:text-white"}`}>
                            {item.q}
                          </span>
                          <span className={`ml-6 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${isExpanded ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-white/5 text-gray-500"}`}>
                            {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                          </span>
                        </button>
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="p-5 md:p-6 pt-0 text-gray-600 dark:text-gray-300 font-Inter leading-relaxed border-t border-gray-100 dark:border-white/5">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
              <h3 className="text-xl font-Outfit font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-gray-600 dark:text-gray-400 font-Inter">We couldn't find any questions matching "{searchQuery}".</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-6 text-primary font-medium hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Contact Support CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-8 md:p-12 text-center border border-primary/20">
          <div className="w-16 h-16 bg-white dark:bg-darkSurface rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-primary text-2xl">
            <FaEnvelope />
          </div>
          <h2 className="text-2xl md:text-3xl font-Outfit font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-Inter mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our dedicated support team is here to help you with any issues or questions you might have.
          </p>
          <a 
            href="mailto:support@3sconsultant.com" 
            className="inline-block px-8 py-3 bg-primary hover:bg-primaryDark text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            Contact Support
          </a>
        </div>

      </section>
    </div>
  );
};

export default FAQPage;
