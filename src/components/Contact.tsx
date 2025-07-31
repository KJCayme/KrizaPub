
import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Edit3 } from 'lucide-react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { useGetInTouch } from '@/hooks/useGetInTouch';
import { useWhyChooseMe } from '@/hooks/useWhyChooseMe';
import { EditGetInTouchForm } from './EditGetInTouchForm';
import { EditWhyChooseMeForm } from './EditWhyChooseMeForm';
import DynamicIcon from './DynamicIcon';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email_client: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGetInTouchForm, setShowGetInTouchForm] = useState(false);
  const [showWhyChooseMeForm, setShowWhyChooseMeForm] = useState(false);
  const { user } = useAuth();
  const { data: getInTouchData } = useGetInTouch();
  const { data: whyChooseMeData } = useWhyChooseMe();

  // Fallback data with example@gmail.com email
  const fallbackGetInTouch = [
    { icon: "Mail", social: "example@gmail.com", caption: "Email" },
    { icon: "Phone", social: "+1234567890", caption: "Phone" },
    { icon: "Linkedin", social: "linkedin.com/in/yourprofile", caption: "LinkedIn" },
    { icon: "Github", social: "github.com/yourusername", caption: "GitHub" },
    { icon: "MapPin", social: "Your Location", caption: "Location" }
  ];

  const fallbackWhyChooseMe = [
    "Dedicated and reliable virtual assistant with proven track record",
    "Excellent communication skills and attention to detail", 
    "Flexible and adaptable to your business needs",
    "Cost-effective solution for your administrative tasks"
  ];

  const contactItems = getInTouchData && getInTouchData.length > 0 
    ? getInTouchData.slice(0, 5)
    : fallbackGetInTouch;

  const whyChooseItems = whyChooseMeData && whyChooseMeData.length > 0
    ? whyChooseMeData.map(item => item.caption)
    : fallbackWhyChooseMe;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting contact form:', formData);
      
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email_client: formData.email_client,
          subject: formData.subject,
          message: formData.message,
          recipientEmail: 'kennethjohncayme@gmail.com'
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        toast.error('Failed to send message. Please try again.');
        return;
      }

      console.log('Email sent successfully:', data);
      toast.success('Message sent successfully!');
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email_client: '', subject: '', message: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-900 dark:bg-slate-950 text-white transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Work Together
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Ready to take your business to the next level? Get in touch and let's discuss 
            how I can help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Get In Touch</h3>
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                  onClick={() => setShowGetInTouchForm(true)}
                >
                  Edit Info
                </Button>
              )}
            </div>
            
            <div className="space-y-6">
              {contactItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <DynamicIcon iconName={item.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.caption}</p>
                    <p className="text-slate-300">{item.social}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Why Choose Me?</h4>
                {user && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                    onClick={() => setShowWhyChooseMeForm(true)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <ul className="space-y-3 text-slate-300">
                {whyChooseItems.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-800 dark:bg-slate-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-green-500 mb-2">Message Sent!</h4>
                <p className="text-slate-300">Thank you for reaching out. I'll get back to you soon!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 dark:bg-slate-800 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors text-white"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email_client"
                    value={formData.email_client}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 dark:bg-slate-800 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors text-white"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 dark:bg-slate-800 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors text-white"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 dark:bg-slate-800 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors resize-none text-white"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Forms */}
      <EditGetInTouchForm
        isOpen={showGetInTouchForm}
        onClose={() => setShowGetInTouchForm(false)}
      />
      
      <EditWhyChooseMeForm
        isOpen={showWhyChooseMeForm}
        onClose={() => setShowWhyChooseMeForm(false)}
      />
    </section>
  );
};

export default Contact;
