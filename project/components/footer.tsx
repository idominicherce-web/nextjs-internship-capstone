import Link from "next/link"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#100A07] border-t-2 border-[#4A2C1D] text-[#F8EEDB] font-serif py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C]">
                <Shield size={18} />
              </div>
              <span className="text-lg font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.15em]">
                ProjectFlow
              </span>
            </div>
            <p className="text-xs font-sans text-[#D7B05C]/70 leading-relaxed italic">
              The Sovereign Project Management Platform designed to unite council members and deliver victories.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h4 className="text-xs font-sans font-black text-[#D7B05C] uppercase tracking-widest mb-3 border-b border-[#4A2C1D] pb-1">
              Chambers
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/dashboard" className="text-[#F8EEDB]/80 hover:text-[#D7B05C] transition-colors">
                  Command Center
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-[#F8EEDB]/80 hover:text-[#D7B05C] transition-colors">
                  Project Archives
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-[#F8EEDB]/80 hover:text-[#D7B05C] transition-colors">
                  Roundtable Council
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h4 className="text-xs font-sans font-black text-[#D7B05C] uppercase tracking-widest mb-3 border-b border-[#4A2C1D] pb-1">
              Intelligence
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/analytics" className="text-[#F8EEDB]/80 hover:text-[#D7B05C] transition-colors">
                  Analytics Chamber
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-[#F8EEDB]/80 hover:text-[#D7B05C] transition-colors">
                  quest Ledger
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-[#F8EEDB]/80 hover:text-[#D7B05C] transition-colors">
                  Realm Configuration
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h4 className="text-xs font-sans font-black text-[#D7B05C] uppercase tracking-widest mb-3 border-b border-[#4A2C1D] pb-1">
              Decree & Royal Guards
            </h4>
            <p className="text-xs font-sans text-[#D7B05C]/70 leading-relaxed italic">
              Synchronized with Neon PostgreSQL & protected by Clerk Realm Authentication.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#4A2C1D] pt-6 text-center text-xs font-sans text-[#D7B05C]/60 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 ProjectFlow • The Roundtable Edition. All rights preserved.</p>
          <p className="italic font-serif">Handcrafted for High Command Operations.</p>
        </div>
      </div>
    </footer>
  )
}