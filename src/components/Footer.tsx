import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';

export const Footer = () => {

  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
            <h3 className="text-2xl font-bold font-playfair">HOK Fashion</h3>
            <p className="text-primary-foreground/80 leading-relaxed font-inter">
              Nigeria's premier luxury handbag brand. Crafting exquisite pieces
              for the modern African woman since 1998.
            </p>
            <div className="flex space-x-4">
              <Button asChild variant="ghost" size="icon" className="text-primary-foreground hover:text-red" aria-label="Visit Instagram">
                <a href="https://www.instagram.com/hok_fashionhousebackup?igsh=MXNsaGFxeG1xczFjMA%3D%3D&utm_source=qr" target="_blank" rel="noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="text-primary-foreground hover:text-red" aria-label="Visit TikTok">
                <a href="https://www.tiktok.com/@hokfashionhouse" target="_blank" rel="noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="text-primary-foreground hover:text-red" aria-label="Email HOK Fashion">
                <a href="mailto:hello@hokfashion.ng">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-playfair">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-red transition-colors font-inter">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/collections/All" className="text-primary-foreground/80 hover:text-red transition-colors font-inter">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/lookbook" className="text-primary-foreground/80 hover:text-red transition-colors font-inter">
                  Lookbook
                </Link>
              </li>
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-red transition-colors font-inter">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-playfair">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-red transition-colors font-inter">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-primary-foreground/80 hover:text-red transition-colors font-inter">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-red transition-colors font-inter">
                  FAQ & Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-playfair">Stay Connected</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80 font-inter">
                <Mail className="h-4 w-4" />
                <span>hello@hokfashion.ng</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80 font-inter">
                <Phone className="h-4 w-4" />
                <span>+234 806 226 7745</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80 font-inter">
                <MapPin className="h-4 w-4" />
                <span>Gishiri by Ecwa Church off Nicon Junction, Abuja</span>
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
            © {currentYear} HOK Fashion. All rights reserved. Crafted with ❤️ for luxury lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};
