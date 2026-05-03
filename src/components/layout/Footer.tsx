import React from 'react';
import { Facebook, Twitter, MapPin, Mail, Phone } from 'lucide-react';
import nepalEmblem from '../../assets/Emblem_of_Nepal.svg';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a4a8c] text-white py-12 mt-12 relative">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* Top Section: Logo and Name */}
        <div className="flex flex-col items-center md:items-start gap-4 mb-12">
          <div className="flex items-center gap-4">
            <img 
              src={nepalEmblem} 
              alt="Emblem of Nepal" 
              className="w-16 h-16 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-widest text-slate-300">नेपाल सरकार</span>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight">
                Digital Registry for Landless and <br /> Informal Settlements
              </h2>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/10 mb-8" />

        {/* Bottom Section: Socials and Contact */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Socials */}
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              {/* Using a custom span for X to match the look if needed, but Twitter is standard */}
              <Twitter size={20} />
            </a>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-6 md:gap-10 text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-200">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-white" />
              <span>सिंहदरबार, काठमाडौं</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-white" />
              <span>test@nepal.gov.np</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-white" />
              <span>+977XXXXXX</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
