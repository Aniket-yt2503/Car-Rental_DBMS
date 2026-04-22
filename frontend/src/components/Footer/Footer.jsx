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
    { label: 'Contact Us', href: 'mailto:hello@midnightride.ca' },
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
    <footer style={{ background: 'rgba(5,5,5,1)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-black tracking-[0.15em] uppercase text-white">Midnight Ride</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white/70 font-bold uppercase tracking-widest">Elite</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-8">
              Canada's premier automotive experience. We deliver more than just rentals; we provide a gateway to elite performance and unparalleled luxury.
            </p>
            <div className="flex gap-4">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-white font-bold text-xs mb-6 uppercase tracking-[0.2em]">{group}</h4>
              <ul className="space-y-4">
                {links.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLink(link)}
                      className="text-slate-500 hover:text-white text-sm transition-all duration-200 cursor-pointer bg-transparent border-none text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-white/5">
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em] mb-4">Strategic Hubs</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {[
              'Toronto HQ', 'Vancouver Metro', 'Montreal Central', 'Calgary West',
              'Ottawa East', 'Edmonton North', 'Winnipeg South', 'Halifax Port',
            ].map(city => (
              <span key={city} className="text-slate-500 text-xs font-medium">{city}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-black/50 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} Midnight Ride Automotive Group
            </p>
            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-800" />
            <p className="text-slate-700 text-[11px] font-black uppercase tracking-widest">
              Private Limited · Strategic Hub Network
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}
