import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MapPin, Loader, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Location {
  x: number;
  y: number;
}

const CivicReportSection = () => {
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState<Location>();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setLocation({ x, y });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      toast({
        title: "Missing information",
        description: "Please describe the issue you'd like to report.",
        variant: "destructive"
      });
      return;
    }

    if (!location) {
      toast({
        title: "Missing location",
        description: "Please mark the issue location on the map.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setDescription('');
      setName('');
      setLocation(undefined);
      setPhoto(null);
      setPhotoPreview('');
      
      toast({
        title: "Report submitted!",
        description: "Thank you for helping improve our city.",
      });
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 2000);
  };

  return (
    <section id="report" className="section-padding bg-white dark:bg-dark/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Civic Report System
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Help improve your neighborhood by reporting infrastructure issues.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Google Maps Embed for Civic Report */}
            <div className="rounded-xl overflow-hidden shadow-lg mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d622.7072322075145!2d77.521654!3d13.0116666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m3!3m2!1d13.0116945!2d77.5220557!4m3!3m2!1d13.0119921!2d77.5221362!4m3!3m2!1d13.0117565!2d77.5214722!5e0!3m2!1sen!2sin!4v1714459532005!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Civic Report Map"
              />
            </div>

            {/* Photo Upload */}
            <div className="glass-card rounded-xl p-6">
              <label className="block text-sm font-medium mb-2">
                Upload Photo (optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="relative block w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary transition-colors cursor-pointer"
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-6">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload a photo
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Your Name (optional)
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium">
                    Issue Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue you're reporting"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[120px] focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 animate-fade-in">
                <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Your report has been submitted successfully. Our team will review it shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CivicReportSection;
