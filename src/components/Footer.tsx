import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';

const TikTokIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M21 8.35c-1.18-.1-2.28-.5-3.26-1.12-.9-.58-1.65-1.35-2.2-2.25V15a6.35 6.35 0 1 1-6.35-6.34c.2 0 .38 0 .58.02V11a3.68 3.68 0 1 0 3.67 3.67V3h2.67c.1.92.44 1.77 1.02 2.52A4.7 4.7 0 0 0 21 7.02v1.33Z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2a9.9 9.9 0 0 0-8.33 15.22L2 22l4.93-1.61A9.9 9.9 0 1 0 12 2Zm0 2a7.9 7.9 0 0 1 6.41 12.57l-.24.32a7.9 7.9 0 0 1-9.7 1.94l-.39-.2-.25.08-2.76.9.92-2.7.12-.36-.22-.34A7.9 7.9 0 0 1 12 4Zm-4.3 3.7c-.14 0-.35.05-.54.26s-.71.7-.71 1.68c0 .99.73 1.94.84 2.08.1.14 1.4 2.25 3.42 3.06 2.03.8 2.2.54 2.6.5.4-.05 1.28-.52 1.46-1.03.19-.52.19-.97.14-1.05-.05-.09-.21-.14-.44-.24-.23-.09-1.36-.67-1.58-.75-.21-.08-.37-.12-.52.12-.14.23-.6.74-.73.89-.14.15-.27.17-.5.06-.23-.12-.97-.36-1.85-1.15-.68-.61-1.14-1.37-1.28-1.6-.13-.23-.01-.36.1-.49.1-.1.23-.26.35-.4.12-.14.15-.23.23-.38.08-.15.04-.29-.02-.4-.07-.12-.6-1.45-.83-1.99-.22-.53-.44-.45-.64-.46Z" />
  </svg>
);

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
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="social-breath text-primary-foreground bg-white/5 hover:bg-red hover:text-red-foreground transition-colors"
                aria-label="Visit Instagram"
              >
                <a href="https://www.instagram.com/hok_fashionhousebackup?igsh=MXNsaGFxeG1xczFjMA%3D%3D&utm_source=qr" target="_blank" rel="noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="social-breath text-primary-foreground bg-white/5 hover:bg-red hover:text-red-foreground transition-colors"
                aria-label="Visit TikTok"
              >
                <a href="https://www.tiktok.com/@hokfashionhouse" target="_blank" rel="noreferrer">
                  <TikTokIcon />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="social-breath text-primary-foreground bg-white/5 hover:bg-red hover:text-red-foreground transition-colors"
                aria-label="Visit Facebook"
              >
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="social-breath text-primary-foreground bg-white/5 hover:bg-red hover:text-red-foreground transition-colors"
                aria-label="Chat on WhatsApp"
              >
                <a href="https://wa.me/2348062267745" target="_blank" rel="noreferrer">
                  <WhatsAppIcon />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="social-breath text-primary-foreground bg-white/5 hover:bg-red hover:text-red-foreground transition-colors"
                aria-label="Email HOK Fashion"
              >
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
