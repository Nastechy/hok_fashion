import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-playfair">HOK Fashion</h3>
            <p className="text-primary-foreground/80 leading-relaxed font-inter">
              Nigeria's premier luxury handbag brand. Crafting exquisite pieces 
              for the modern African woman since 1998.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-red">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-red">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-red">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-playfair">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Collections', 'Size Guide', 'Care Instructions', 'Lookbook'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/80 hover:text-red transition-colors font-inter">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-playfair">Customer Service</h4>
            <ul className="space-y-2">
              {['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/80 hover:text-red transition-colors font-inter">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-playfair">Stay Connected</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80 font-inter">
                <Mail className="h-4 w-4" />
                <span>hello@hokfashion.ng</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80 font-inter">
                <Phone className="h-4 w-4" />
                <span>+234 802 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80 font-inter">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-primary-foreground/80 font-inter">
                Subscribe to our newsletter for exclusive offers
              </p>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 font-inter"
                />
                <Button variant="elegant" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm font-inter">
            © 2024 HOK Fashion. All rights reserved. Crafted with ❤️ for luxury lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};