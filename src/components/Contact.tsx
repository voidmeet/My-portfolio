
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';
import { Github, Linkedin, Phone, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use environment variables configured in Vite: VITE_EMAILJS_* keys
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Email service is not configured.');
      }

      // Initialize EmailJS (required once in app lifecycle)
      emailjs.init(publicKey);

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'meetlearns@gmail.com',
        }
      );

      toast({
        title: 'Message sent successfully',
        description: "Thanks for reaching out. I'll respond shortly.",
      });

      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Failed to send message',
        description: 'Please try again later or email me directly at meetlearns@gmail.com.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-gradient">LET'S BUILD TOGETHER</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to scale your infrastructure? Tell me a bit about your goals and timeline.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Contact Form */}
          <div className="glass-effect p-8 rounded-2xl border-gradient animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground font-jetbrains">
                  Name / Organization
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-muted/50 border-muted focus:border-neon-blue transition-colors"
                  placeholder="Your name or company"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground font-jetbrains">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-muted/50 border-muted focus:border-neon-blue transition-colors"
                  placeholder="your.email@company.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground font-jetbrains">
                  Project Details
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="bg-muted/50 border-muted focus:border-neon-blue transition-colors resize-none"
                  placeholder="Tell me about your infrastructure challenges, scaling needs, or deployment requirements..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-cyber hover:scale-105 transition-all duration-300 neon-glow py-3 font-medium"
              >
                {isSubmitting ? 'Deploying Message...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass-effect p-6 rounded-xl border-gradient">
              <h3 className="text-xl font-bold text-gradient mb-4 font-jetbrains">
                Contact Details
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a href="mailto:meetlearns@gmail.com" className="text-neon-blue hover:underline">meetlearns@gmail.com</a>
                </div>
                <div>
                  <p className="font-medium text-foreground">Availability</p>
                  <p>Open to remote projects</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-foreground">Usually responds within 4–6 hours</span>
                </div>
              </div>
            </div>

            <div className="glass-effect p-6 rounded-xl border-gradient">
              <h3 className="text-xl font-bold text-gradient mb-4 font-jetbrains">
                Connect
              </h3>
              <div className="flex gap-3 flex-wrap">
                {[
                  { name: 'GitHub', url: 'https://github.com/voidmeet', Icon: Github },
                  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/meet-bundela-42705a17a', Icon: Linkedin },
                  { name: 'Call', url: 'tel:7228880828', Icon: Phone },
                  { name: 'WhatsApp', url: 'https://wa.me/9428209494', Icon: MessageCircle },
                ].map(({ name, url, Icon }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="p-3 rounded-full border-gradient glass-effect hover:scale-110 transition-all duration-300 text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-effect p-6 rounded-xl border-gradient">
              <h3 className="text-xl font-bold text-gradient mb-4 font-jetbrains">
                Current Availability
              </h3>
              <p className="text-sm text-muted-foreground">
                Open to DevOps consulting, infrastructure audits, and migration projects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Network Lines */}
      <div className="absolute top-1/3 left-10 w-px h-20 bg-gradient-to-b from-neon-blue to-transparent opacity-30" />
      <div className="absolute bottom-1/4 right-20 w-20 h-px bg-gradient-to-r from-neon-purple to-transparent opacity-30" />
    </section>
  );
};

export default Contact;
