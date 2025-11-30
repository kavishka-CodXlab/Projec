import React from 'react';
import { Database, Globe, Server, Cpu } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ScrambleText from './ui/ScrambleText';

const SkillCard = ({ category, index }: { category: any, index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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

  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative h-full perspective-1000"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10`}></div>
      <div className="glass-card h-full rounded-2xl p-6 border border-white/10 group-hover:border-cyan-400/50 transition-all duration-300 relative overflow-hidden">

        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div className="relative z-10 transform-style-3d group-hover:translate-z-10">
          <div className={`w-14 h-14 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-shadow duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>

          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">{category.name}</h3>

          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill: string, skillIndex: number) => (
              <span
                key={skillIndex}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-white/5 text-gray-300 border border-white/10 group-hover:border-cyan-400/30 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 transition-all duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const skillCategories = [
    {
      name: 'Frontend',
      icon: Globe,
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vue.js', 'Angular'],
      color: 'from-cyan-400 to-blue-600'
    },
    {
      name: 'Backend',
      icon: Server,
      skills: ['Node.js', 'Express', 'Python', 'Java', 'Go'],
      color: 'from-blue-600 to-indigo-600'
    },
    {
      name: 'Database & Cloud',
      icon: Database,
      skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'AWS', 'Docker', 'Firebase', 'Azure'],
      color: 'from-indigo-600 to-violet-600'
    },
    {
      name: 'Architecture & Tools',
      icon: Cpu,
      skills: ['GitLab', 'Jenkins', 'Git', 'CI/CD', 'Linux', 'Figma'],
      color: 'from-violet-600 to-purple-600'
    }
  ];

  return (
    <section id="skills" className="py-24 bg-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

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
              SYSTEM_CAPABILITIES
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            <ScrambleText
              text="A comprehensive toolkit for building scalable, high-performance digital solutions."
              className="text-gray-400"
              scrambleSpeed={50}
            />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.name} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
