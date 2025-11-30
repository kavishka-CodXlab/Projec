import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import RevealText from './ui/RevealText';
import { Canvas } from '@react-three/fiber';
import FlyingPlane from './canvas/FlyingPlane';
import { Suspense } from 'react';

const Contact: React.FC = () => {
  const { addMessage } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add message to context
    addMessage(formData);

    console.log('Sending email to tkavishka101@gmail.com:', formData);

    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });

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
      href: 'mailto:tkavishka101@gmail.com',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+94 703375336',
      href: 'tel:+94703375336',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Sri Jayawardanapura Kotte, Sri Lanka',
      href: '#',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <section id="contact" className="py-24 bg-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 text-sm font-mono tracking-wider backdrop-blur-sm">
              INITIATE_UPLINK
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            <RevealText
              text="I'm always open to discussing new opportunities, creative projects, or just having a chat about technology."
              className="text-gray-400"
              delay={0.2}
            />
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 3D Flying Plane Animation Overlay */}
          {/* <div className="absolute inset-0 z-0 pointer-events-none h-[120%] -top-[10%] w-[120%] -left-[10%]">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ alpha: true }} style={{ background: 'transparent' }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Suspense fallback={null}>
                <FlyingPlane />
              </Suspense>
            </Canvas>
          </div> */}

          {/* Contact Information */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 relative inline-block">
                Let's Connect
                {/* The 't' corner marker for reference - visually hidden or just implicit */}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                Feel free to reach out if you want to collaborate on a project, have a question, or just want to connect.
              </p>
            </motion.div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group block p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1 group-hover:text-cyan-400 transition-colors">{info.label}</h4>
                        <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                          {info.value}
                        </span>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-3xl blur opacity-20 -z-10"></div>
            <div className="bg-dark/80 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <label
                    htmlFor="name"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'name' || formData.name
                      ? '-top-2.5 text-xs text-cyan-400 bg-dark px-2'
                      : 'top-3.5 text-gray-400'
                      }`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                  />
                </div>

                <div className="relative group">
                  <label
                    htmlFor="email"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'email' || formData.email
                      ? '-top-2.5 text-xs text-cyan-400 bg-dark px-2'
                      : 'top-3.5 text-gray-400'
                      }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                  />
                </div>

                <div className="relative group">
                  <label
                    htmlFor="message"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'message' || formData.message
                      ? '-top-2.5 text-xs text-cyan-400 bg-dark px-2'
                      : 'top-3.5 text-gray-400'
                      }`}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group ${isSubmitted
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                    } ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      <span>Message Sent!</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Send Message</span>
                      <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 group-hover:animate-shine"></div>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;