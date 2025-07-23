import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Contact: React.FC = () => {
  const { addMessage } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add message to context
    addMessage(formData);

    // Simulate sending email (in real app, this would call an API)
    console.log('Sending email to tkavishka101@gmail.com:', formData);

    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });

    // Reset success state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'info.kavishkathilakarathna@gmail.com',
      href: 'mailto:tkavishka101@gmail.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+94 703375336',
      href: 'tel:+441234567890'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Sri Jayawardanapura Kotte, Sri Lanka',
      href: '#'
    }
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-slate-800/50 relative">
      {/* Animated Contact Theme Background - Modern Style */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(14)].map((_, i) => (
          <svg
            key={i}
            width={40 + Math.random() * 40}
            height={40 + Math.random() * 40}
            style={{
              position: 'absolute',
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              opacity: 0.08 + Math.random() * 0.22,
              animation: `floatModern${i} 16s ease-in-out infinite`,
              zIndex: 0
            }}
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="40" cy="40" rx="32" ry="18" fill="#3B82F6" />
            <rect x="24" y="32" width="32" height="8" rx="4" fill="#fff" />
            <polygon points="40,16 48,32 32,32" fill="#8B5CF6" />
            <circle cx="40" cy="56" r="6" fill="#6366f1" />
          </svg>
        ))}
        <style>{`
          ${[...Array(14)].map((_, i) => `@keyframes floatModern${i} {
            0% { transform: translateY(0); }
            50% { transform: translateY(-24px); }
            100% { transform: translateY(0); }
          }`).join(' ')}
        `}</style>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get In <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Touch</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities, creative projects, or just having a chat about technology.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>
                <p className="text-gray-300 leading-relaxed mb-8">
                  Feel free to reach out if you want to collaborate on a project, have a question, or just want to connect.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={info.label}
                      className={`flex items-center space-x-4 p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{info.label}</h4>
                        <a
                          href={info.href}
                          className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                        >
                          {info.value}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                    placeholder="Tell me about your project or just say hello..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitted
                      ? 'bg-green-600 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105'
                  } ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Message Sent!</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;