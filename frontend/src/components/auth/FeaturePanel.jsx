import { motion } from 'framer-motion';
import { Target, Zap, BarChart3, Brain, Shield } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Goal Planning', description: 'Intelligent goal decomposition' },
  { icon: Zap, title: 'Smart Daily Planner', description: 'AI-powered schedule optimization' },
  { icon: BarChart3, title: 'Progress Analytics', description: 'Real-time productivity insights' },
  { icon: Target, title: 'Productivity Insights', description: 'Personalized recommendations' },
];

const statCards = [
  { value: '92%', label: 'Goal Completion' },
  { value: '3.2x', label: 'Productivity Boost' },
  { value: '24/7', label: 'AI Assistance' },
];

export default function FeaturePanel() {
  return (
    <div className="w-full max-w-lg flex flex-col items-center text-center">
      {/* Logo / Brand */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-strong mb-4">
          <Brain size={32} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-text mb-2">Synvex AI</h1>
        <p className="text-lg text-text-secondary max-w-sm mx-auto">
          Plan Smarter.<br /><span className="text-primary">Achieve Faster.</span>
        </p>
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="text-text-muted mb-12 max-w-sm mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Your intelligent productivity companion that transforms goals into achievements.
      </motion.p>

      {/* Feature List */}
      <motion.div
        className="w-full mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ul className="space-y-4 text-left" role="list">
          {features.map((feature, index) => (
            <motion.li
              key={feature.title}
              className="flex items-start gap-4 p-4 glass rounded-xl group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ x: 4 }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg glass-strong flex items-center justify-center text-primary">
                <feature.icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-text">{feature.title}</h3>
                <p className="text-sm text-text-muted">{feature.description}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        className="w-full glass p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid grid-cols-3 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + index * 0.08 }}
            >
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating decorative cards */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[
          { top: '10%', right: '5%', delay: 0 },
          { bottom: '20%', left: '8%', delay: 0.5 },
          { top: '40%', left: '2%', delay: 1 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 glass rounded-2xl flex items-center justify-center"
            style={{ top: pos.top, right: pos.right, bottom: pos.bottom, left: pos.left }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ delay: 0.6 + pos.delay, duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          >
            <Shield size={24} className="text-primary/50" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}