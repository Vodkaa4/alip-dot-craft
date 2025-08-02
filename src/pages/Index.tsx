import React from 'react';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import TypingAnimation from '@/components/TypingAnimation';
import SocialButton from '@/components/SocialButton';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  const titles = [
    'Software Engineer',
    'Web Developer', 
    'Creative Coder',
    'Full Stack Developer',
    'UI/UX Enthusiast'
  ];

  const socialLinks = [
    {
      icon: <Github className="w-6 h-6" />,
      href: 'https://github.com/Vodkaa4',
      label: 'GitHub Profile'
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      href: 'https://www.linkedin.com/in/muhamad-alip-bunyamin-26120125b/',
      label: 'LinkedIn Profile'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      href: '/resume-clean.html',
      label: 'View Resume'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      href: 'mailto:alifzaelani22@gmail.com',
      label: 'Send Email'
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Name */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 animate-fade-in">
            <span className="bg-gradient-text bg-clip-text text-transparent">
              Muhamad Alip
            </span>
            <br />
            <span className="text-foreground font-light">
              Bunyamin
            </span>
          </h1>
          
          {/* Typing Animation */}
          <div className="h-16 flex items-center justify-center mb-12">
            <span className="text-2xl md:text-3xl lg:text-4xl font-mono text-muted-foreground">
              <TypingAnimation 
                texts={titles}
                speed={100}
                pauseDuration={2000}
              />
            </span>
          </div>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up">
            Passionate about creating beautiful, functional, and user-friendly applications 
            that solve real-world problems through clean code and innovative design.
          </p>
          
          {/* Social Media Buttons */}
          <div className="flex justify-center items-center gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {socialLinks.map((social, index) => (
              <SocialButton
                key={index}
                icon={social.icon}
                href={social.href}
                label={social.label}
                className="animate-float"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-electric-blue rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Watermark */}
      <div className="fixed bottom-4 right-4 z-20">
        <p className="text-sm text-muted-foreground/60 font-mono">
          Edit by Alip
        </p>
      </div>
      
      {/* Background Glow Effect */}
      <div className="fixed inset-0 bg-gradient-glow pointer-events-none z-0" />
    </div>
  );
};

export default Index;
