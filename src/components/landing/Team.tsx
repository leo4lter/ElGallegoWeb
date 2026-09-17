import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { UserCircle } from 'lucide-react';
import type { TeamMember } from '@/lib/supabase';

export default function Team() {
  const { teamMembers, loading } = useData();

  if (!loading && teamMembers.length === 0) return null;

  const gridCols = Math.min(teamMembers.length, 4);

  return (
    <section id="equipo" className="section-py bg-white">
      <div className="max-w-8xl mx-auto container-px">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-px bg-terracotta-500" />
            <span className="text-terracotta-500 text-sm font-semibold tracking-widest uppercase">
              Nuestro Equipo
            </span>
            <div className="w-10 h-px bg-terracotta-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-charcoal-900">
            Las personas detrás de cada obra
          </h2>
          <p className="text-charcoal-500 text-lg mt-6 leading-relaxed">
            Un equipo comprometido con la calidad, la experiencia y la trayectoria
            que define a Constructora El Gallego.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-charcoal-100 mb-4" />
                <div className="h-5 bg-charcoal-100 w-2/3 mb-2" />
                <div className="h-4 bg-charcoal-100 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="grid gap-8"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            }}
          >
            {teamMembers.map((member, i) => (
              <TeamCard key={member.id} member={member} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-charcoal-100 mb-5">
        {member.image_url ? (
          <img
            src={member.image_url}
            alt={member.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <UserCircle className="w-24 h-24 text-charcoal-300" strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="text-xl text-charcoal-900 font-semibold">{member.name}</h3>
      <p className="text-terracotta-500 text-sm font-medium mt-1">{member.role}</p>
      {member.bio && (
        <p className="text-charcoal-500 text-sm mt-3 leading-relaxed line-clamp-3">
          {member.bio}
        </p>
      )}
    </motion.div>
  );
}
