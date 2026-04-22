import { useNavigate } from 'react-router-dom'

const FOOTER_LINKS = {
  Company: [
    { label: 'About Us', anchor: 'about' },
    { label: 'Our Fleet', route: '/vehicles' },
    { label: 'Locations', route: '/locations' },
    { label: 'Pricing', route: '/vehicles', anchor: 'pricing' },
  ],
  Support: [
    { label: 'FAQs', anchor: 'faqs' },
    { label: 'Rental Policies', anchor: 'policy' },
    { label: 'Contact Us', href: 'mailto:hello@phantomride.ca' },
    { label: 'Promotions', anchor: 'promotions' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Accessibility', href: '#' },
  ],
}

const SOCIAL = [
  { label: 'Twitter / X', icon: '𝕏', href: '#' },
  { label: 'Instagram', icon: '◈', href: '#' },
  { label: 'LinkedIn', icon: 'in', href: '#' },
  { label: 'Facebook', icon: 'f', href: '#' },
]

export default function Footer() {
  const navigate = useNavigate()

  function handleLink(item) {
    if (item.href) { window.open(item.href, '_blank'); return }
    if (item.route) {
      navigate(item.route)
      if (item.anchor) {
        setTimeout(() => {
          const el = document.getElementById(item.anchor)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 120)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (item.anchor) {
      const el = document.getElementById(item.anchor)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer style={{ background: 'rgba(2,2,8,0.95)', borderTop: '1px solid rgba(124,58,237,0.2)' }}>
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black tracking-widest phantom-text">Phantom Ride</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium">Premium</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Canada's most trusted premium car rental service. Seamless booking, transparent pricing, and vehicles that make every journey memorable.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-purple-600/30 hover:border-purple-500/50 transition-all duration-200 text-xs font-bold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{group}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLink(link)}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-150 cursor-pointer bg-transparent border-none text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Locations quick list */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(124,58,237,0.12)' }}>
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Our Locations</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {[
              'Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB',
              'Ottawa, ON', 'Edmonton, AB', 'Winnipeg, MB', 'Halifax, NS',
            ].map(city => (
              <span key={city} className="text-white/40 text-xs">{city}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(124,58,237,0.12)', background: 'rgba(0,0,0,0.5)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p className="text-white/35 text-xs">
              © {new Date().getFullYear()} Phantom Ride Car Rentals Inc. All rights reserved.
            </p>
            <span className="hidden sm:inline text-white/20 text-xs">·</span>
            <p className="text-white/25 text-xs">
              Designed & developed by{' '}
              <span className="text-purple-400/70 font-semibold">Team Brutal</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/20 text-xs">Registered in Canada</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/30 text-xs">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
