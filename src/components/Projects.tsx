import React from 'react';
import { ExternalLink, Github, Code, Loader2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ProjectCard = ({ project }: { project: any }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
      <div className="glass-card h-full rounded-2xl overflow-hidden border border-white/10 group-hover:border-cyan-400/50 transition-colors duration-300 flex flex-col">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-10 opacity-80"></div>
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg';
            }}
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
            <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-dark/90 rounded-full text-white hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all border border-white/10 hover:border-cyan-400/50"
                  title="View Code"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-dark/90 rounded-full text-white hover:text-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all border border-white/10 hover:border-blue-500/50"
                  title="Live Demo"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-grow flex flex-col relative z-20">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-600 transition-all duration-300">
              {project.title}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100" />
          </div>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.technologies.map((tech: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 text-[10px] uppercase tracking-wider font-medium rounded-md bg-white/5 text-gray-300 border border-white/10 group-hover:border-cyan-400/30 group-hover:text-cyan-400 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const { projects, loading, error } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-dark min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-dark min-h-screen flex items-center justify-center">
        <div className="text-center text-red-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-dark relative overflow-hidden">
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
              INNOVATION_HUB
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Exploring the boundaries of code and creativity.
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <Code className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No projects found yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000"
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;