import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Award, Trophy, FileCheck2, Cpu, Languages, Copy, Check } from 'lucide-react'

const CertsAchievements = () => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-gradient">CERTIFICATES & ACHIEVEMENTS</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Highlights of credentials, recognitions, and contributions.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {/* Certification */}
          <div className="glass-effect p-6 rounded-2xl border-gradient animate-slide-up hover:shadow-neon-blue transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gradient mb-3 font-jetbrains flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-neon-green" /> AWS Certified Cloud Practitioner
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-muted-foreground">Verification code:</span>
                  <span className="px-2 py-1 rounded-md bg-tech-gray border border-muted font-mono text-foreground select-all">
                    MT19KE5KR11QQKKW
                  </span>
                  <button
                    type="button"
                    aria-label="Copy verification code"
                    className="p-2 rounded-md border-gradient glass-effect hover:scale-105 transition-all"
                    onClick={() => handleCopy('MT19KE5KR11QQKKW')}
                  >
                    {copied ? <Check className="h-4 w-4 text-neon-green" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <a
                  href="https://aws.amazon.com/verification"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 btn-neon-gradient rounded-md font-jetbrains text-sm"
                >
                  Verify on AWS
                </a>
              </div>
              <Badge className="bg-gradient-cyber text-background">Credential</Badge>
            </div>
          </div>

          {/* Achievements */}
          <div className="glass-effect p-6 rounded-2xl border-gradient animate-slide-up hover:shadow-neon-blue transition-all duration-300" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-bold text-gradient mb-4 font-jetbrains flex items-center gap-2">
              <Award className="h-5 w-5 text-neon-yellow" /> Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border-gradient glass-effect hover:scale-[1.02] transition-transform">
                <div className="flex items-start gap-2 text-sm text-foreground">
                  <Trophy className="h-4 w-4 mt-0.5 text-neon-blue" /> Guinness World Record with GUVI and IIT Madras
                </div>
              </div>
              <div className="p-4 rounded-xl border-gradient glass-effect hover:scale-[1.02] transition-transform">
                <div className="flex items-start gap-2 text-sm text-foreground">
                  <Trophy className="h-4 w-4 mt-0.5 text-neon-blue" /> Ideathon winner (University hackathon)
                </div>
              </div>
              <div className="p-4 rounded-xl border-gradient glass-effect hover:scale-[1.02] transition-transform">
                <div className="flex items-start gap-2 text-sm text-foreground">
                  <Trophy className="h-4 w-4 mt-0.5 text-neon-blue" /> Smart India Hackathon participant — Zebra Energy
                </div>
              </div>
              <div className="p-4 rounded-xl border-gradient glass-effect hover:scale-[1.02] transition-transform">
                <div className="flex items-start gap-2 text-sm text-foreground">
                  <FileCheck2 className="h-4 w-4 mt-0.5 text-neon-purple" /> International research paper at ICRACSIT
                </div>
              </div>
              <div className="p-4 rounded-xl border-gradient glass-effect hover:scale-[1.02] transition-transform sm:col-span-2">
                <div className="flex items-start gap-2 text-sm text-foreground">
                  <Cpu className="h-4 w-4 mt-0.5 text-neon-green" /> Built an IoT device: Third Eye
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="mt-8 glass-effect p-6 rounded-2xl border-gradient animate-slide-up hover:shadow-neon-blue transition-all duration-300" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-bold text-gradient mb-4 font-jetbrains flex items-center gap-2">
            <Languages className="h-5 w-5 text-neon-cyan" /> Languages
          </h3>
          <div className="flex flex-wrap gap-3">
            {['English', 'Gujarati', 'Hindi'].map((lang) => (
              <span key={lang} className="px-3 py-1 rounded-full border-gradient glass-effect text-sm">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CertsAchievements


