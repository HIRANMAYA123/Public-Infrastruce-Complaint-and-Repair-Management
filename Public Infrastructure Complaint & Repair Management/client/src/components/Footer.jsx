import React from 'react';
import { Shield, PhoneCall, Mail, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-navy-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-teal-700 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">CivicFix</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Unified municipal platform enabling citizens, field crews, and urban administrators to collaborate on resolving infrastructure bottlenecks.
            </p>
            <p className="text-[11px] text-slate-500">
              Department of Municipal Administration & Urban Development
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Infrastructure Sectors</h5>
            <ul className="space-y-1.5 text-slate-400">
              <li>Roads & Asphalt Pavements</li>
              <li>Water Mains & Supply Logistics</li>
              <li>Public Street Illumination</li>
              <li>Stormwater & Flood Abatement</li>
              <li>Solid Waste & Sanitation</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Emergency Desks</h5>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                <span>Central Helpline: 1800-202-0100</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                <span>Disaster Response: 108 / 112</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>complaints@civicfix.gov.in</span>
              </div>
            </div>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Database Architecture</h5>
            <p className="text-slate-400 text-xs leading-relaxed">
              Engineered with MongoDB document collections, aggregation pipelines, schema validation, compound indexing, and real-time change streams.
            </p>
            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 rounded bg-navy-800 text-teal-400 text-[11px] font-mono border border-navy-700">
                100% MongoDB & Mongoose Stack
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 CivicFix Municipal Governance System. All rights reserved.</p>
          <p>Production Quality Civic Technology • MongoDB Powered</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
