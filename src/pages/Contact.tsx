import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { hokApi } from '@/services/hokApi';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const Contact = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' });

  const contactMutation = useMutation({
    mutationFn: () =>
      hokApi.submitContactMessage({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        subject: form.subject,
        message: form.message,
      }),
    onSuccess: () => {
      toast({ title: 'Message sent', description: 'We will get back to you shortly.' });
      setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    },
    onError: (error: any) => {
      toast({ title: 'Unable to send message', description: error?.message || 'Please try again.', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container px-4 md:px-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground mb-4 font-playfair">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-inter">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="font-playfair">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red/10 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-red" />
                    </div>
                    <div>
                      <p className="font-semibold font-inter">Email</p>
                      <p className="text-muted-foreground font-inter">hello@hokfashion.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red/10 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-red" />
                    </div>
                    <div>
                      <p className="font-semibold font-inter">Phone</p>
                      <p className="text-muted-foreground font-inter">+234 806 226 7745</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-red" />
                    </div>
                    <div>
                      <p className="font-semibold font-inter">Address</p>
                      <p className="text-muted-foreground font-inter">Gishiri by Ecwa Church off Nicon Junction, Abuja</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-red" />
                    </div>
                    <div>
                      <p className="font-semibold font-inter">Hours</p>
                      <p className="text-muted-foreground font-inter">24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="font-playfair">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2 font-inter">
                          First Name
                        </label>
                        <Input 
                          placeholder="Enter your first name" 
                          required 
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className="font-inter"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2 font-inter">
                          Last Name
                        </label>
                        <Input 
                          placeholder="Enter your last name" 
                          required 
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className="font-inter"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2 font-inter">
                        Email
                      </label>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        required 
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="font-inter"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2 font-inter">
                        Subject
                      </label>
                        <Input 
                          placeholder="Enter the subject (optional)" 
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="font-inter"
                        />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2 font-inter">
                        Message
                      </label>
                        <Textarea 
                          placeholder="Enter your message" 
                          required 
                          rows={6}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="font-inter"
                        />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="luxury" 
                      size="lg" 
                      className="w-full font-inter font-medium"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
