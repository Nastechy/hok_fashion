import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
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
                      <p className="text-muted-foreground font-inter">Gishiri by Ecwa Church off Nicon Junction, Abuja<br />New York, NY 10001</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-red" />
                    </div>
                    <div>
                      <p className="font-semibold font-inter">Hours</p>
                      <p className="text-muted-foreground font-inter">Mon-Fri: 9AM-6PM<br />Sat-Sun: 10AM-4PM</p>
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
                        className="font-inter"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2 font-inter">
                        Subject
                      </label>
                      <Input 
                        placeholder="Enter the subject" 
                        required 
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
                        className="font-inter"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="luxury" 
                      size="lg" 
                      className="w-full font-inter font-medium"
                    >
                      Send Message
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