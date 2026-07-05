import { Mail, MessageCircle, Send } from 'lucide-react';
import { Button } from './ui/button';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ContactSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Feedback received',
      description: "Thanks for helping make A Help Deck better.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-12 md:py-24 lg:py-32 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`reveal ${isVisible ? 'visible' : ''}`}>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Send Feedback
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Found a bug? Missing a feature? Have a study resource worth
                  sharing? Let us know.
                </p>

                <div className="space-y-4 md:space-y-6">
                  <div className="glass-card p-4 md:p-5 flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center flex-shrink-0 border border-primary/10">
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">What to send</h4>
                      <p className="text-muted-foreground text-sm">
                        Feature ideas, bug reports, or suggestions for new
                        study tools and resources.
                      </p>
                    </div>
                  </div>

                  <div className="glass-card p-4 md:p-5 flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center flex-shrink-0 border border-primary/10">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Response time</h4>
                      <p className="text-muted-foreground text-sm">
                        We read every message and reply when we can.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card-elevated p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Message us
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground resize-none"
                      placeholder="What would you like to tell us?"
                    />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    Send Feedback
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
