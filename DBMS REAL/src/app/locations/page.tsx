'use client';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

const LOCATIONS = [
  { id: 1, city: 'Toronto', address: '100 Main St, ON M5V 2K7', phone: '+1 (416) 555-0101', status: 'Open Now' },
  { id: 2, city: 'Hamilton', address: '200 King St, ON L8P 1A2', phone: '+1 (905) 555-0202', status: 'Open Now' },
  { id: 3, city: 'Ottawa', address: '300 Queen St, ON K1P 5A4', phone: '+1 (613) 555-0303', status: 'Closing Soon' },
];

export default function Locations() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">Our Hubs</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
          Find an Aura flagship location near you. Pick up or drop off your vehicle seamlessly across our regional network.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {LOCATIONS.map((loc, i) => (
          <motion.div
            key={loc.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-3xl relative overflow-hidden group hover:border-primary/40 transition-colors"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all -z-10" />

            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/10 p-3 rounded-2xl">
                <MapPin className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{loc.city}</h3>
                <span className="text-xs text-green-400 font-semibold px-2 py-1 bg-green-400/10 rounded-full">{loc.status}</span>
              </div>
            </div>

            <div className="space-y-4 text-gray-300">
              <p className="flex items-start gap-4 text-sm">
                <MapPin className="w-5 h-5 opacity-50 shrink-0" />
                <span>{loc.address}</span>
              </p>
              <p className="flex items-center gap-4 text-sm">
                <Phone className="w-5 h-5 opacity-50 shrink-0" />
                <span>{loc.phone}</span>
              </p>
              <p className="flex items-center gap-4 text-sm">
                <Clock className="w-5 h-5 opacity-50 shrink-0" />
                <span>Mon-Sun: 8AM - 8PM</span>
              </p>
            </div>

            <button className="w-full mt-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-sm font-semibold">
              Get Directions
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
