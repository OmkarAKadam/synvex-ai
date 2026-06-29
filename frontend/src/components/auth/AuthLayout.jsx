import { Brain, Check } from 'lucide-react'

const features = [
  { icon: Check, color: 'text-primary', bg: 'bg-primary/10', title: 'AI Planning', desc: 'Intelligent task breakdown and scheduling' },
  { icon: Check, color: 'text-accent', bg: 'bg-accent/10', title: 'Goal Tracking', desc: 'Real-time progress monitoring' },
  { icon: Check, color: 'text-primary', bg: 'bg-primary/10', title: 'Smart Analytics', desc: 'Data-driven insights and recommendations' },
]

export default function AuthLayout({
  children,
  isLogin = true,
  onSwitch,
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg px-4 py-16">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col lg:flex-row w-full bg-surface border border-border rounded-xl shadow-md overflow-hidden">
          {/* Left branding panel */}
          <div className="hidden lg:flex lg:w-[45%] p-12 xl:p-16 flex-col justify-center border-b lg:border-b-0 lg:border-r border-border bg-gradient-to-br from-transparent via-primary/[0.02] to-accent/[0.02]">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-10">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain size={18} className="text-primary" />
              </div>
              <span className="font-bold text-xl text-text tracking-tight">Synvex AI</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl xl:text-4xl font-bold text-text tracking-tight leading-tight mb-4">
              Plan Smarter.<br />
              Execute Better.
            </h2>

            {/* Description */}
            <p className="text-sm xl:text-base text-text-secondary leading-relaxed mb-10">
              AI-powered productivity platform that helps you plan, track, and achieve your goals with intelligent insights.
            </p>

            {/* Features */}
            <div className="space-y-5 mb-10">
              {features.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full ${item.bg} flex items-center justify-center mt-0.5 shrink-0`}>
                    <item.icon size={12} className={item.color} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">{item.title}</p>
                    <p className="text-xs text-text-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CSS abstract illustration */}
            <div className="relative h-44 w-full overflow-hidden">
              <div className="absolute inset-0 bg-radial-primary opacity-60" />
              <div className="absolute -top-4 right-4 w-24 h-24 rounded-full border-2 border-primary/15" />
              <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-accent/30" />
              <div className="absolute top-6 left-8 w-10 h-10 rounded-xl border border-accent/15 rotate-45" />
              <div className="absolute bottom-6 right-10 w-14 h-14 rounded-xl bg-primary/5 border border-primary/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-dashed border-primary/10" />
              <div className="absolute top-12 right-12 w-4 h-4 rounded-full bg-primary/20" />
            </div>
          </div>

          {/* Right form panel */}
          <div className="w-full lg:w-[55%] p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
            {children}

            {onSwitch && (
              <div className="mt-8 text-center text-sm text-text-muted">
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitch}
                      className="text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Create Account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitch}
                      className="text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
