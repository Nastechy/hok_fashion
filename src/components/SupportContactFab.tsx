import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, Headset } from 'lucide-react';

const SUPPORT_PHONE = '+2348062267745';
const SUPPORT_EMAIL = 'hello@hokfashion.com';
const SUPPORT_WHATSAPP = '2348062267745';

const SupportContactFab = () => {
  const [open, setOpen] = useState(false);

  const handleCall = () => {
    window.open(`tel:${SUPPORT_PHONE}`, '_self');
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${SUPPORT_WHATSAPP}`, '_blank');
  };

  const handleMessage = () => {
    window.location.href = '/contact';
  };

  return (
    <>
      <button
        type="button"
        aria-label="Contact support"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-28 md:bottom-16 z-50 bg-green-600 text-white shadow-card hover:bg-green-700 active:scale-95 transition-all rounded-full h-12 w-12 flex items-center justify-center support-breathe"
      >
        <Headset className="h-6 w-6" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Need help?</DialogTitle>
            <DialogDescription>Reach support the way you prefer.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Button onClick={handleCall} variant="default" className="flex items-center gap-2 justify-center">
              <Phone className="h-4 w-4" />
              Call our customer support
            </Button>
            <Button onClick={handleWhatsApp} variant="outline" className="flex items-center gap-2 justify-center">
              <MessageCircle className="h-4 w-4" />
              Send a WhatsApp message
            </Button>
            <Button onClick={handleMessage} variant="secondary" className="flex items-center gap-2 justify-center">
              <Mail className="h-4 w-4" />
              Send us a message here
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportContactFab;
