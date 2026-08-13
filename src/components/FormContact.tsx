import { useState } from "react";
import { ButtonPrimary } from "./ButtonPrimary";
import type { FeedbackInput } from "../types";
import { useSubmitFeedback } from "../hooks/useFeedback";
import { CircularProgress, Snackbar } from "@mui/material";

export const FormContact: React.FC = () => {
  const { submitFeedback, loading } = useSubmitFeedback();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FeedbackInput>({
    text: '',
    email: null,
    name: null
  });

  const isDisabled = 
    loading || 
    formData.text.trim() === '' ||
    !formData.email?.trim() ||
    !formData.name?.trim();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || null
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const mutationResponse = await submitFeedback(formData);
      setIsSubmitted(mutationResponse?.success || false);
      
      setFormData({
        text: '',
        email: null,
        name: null
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        open={isSubmitted}
        onClose={handleClose}
        message="Thank you! We received your message!"
        key="topright"
        className="bg-white text-primary-charcoal w-full py-4"
      />
      
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm text-primary-charcoal">
          Name
          <input 
            name="name"
            type="text" 
            placeholder="Your name" 
            value={formData.name || ''}
            onChange={handleInputChange}
            className="rounded-[12px] border border-primary-medium-gray px-[14px] py-3 w-full focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
        </label>
        
        <label className="grid gap-2 text-sm text-primary-charcoal">
          Email
          <input 
            name="email"
            type="email" 
            placeholder="you@example.com" 
            value={formData.email || ''}
            onChange={handleInputChange}
            className="rounded-[12px] border border-primary-medium-gray px-[14px] py-3 w-full focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
        </label>
        
        <label className="grid gap-2 text-sm text-primary-charcoal">
          Message
          <textarea 
            name="text"
            placeholder="How can we help?" 
            rows={5} 
            value={formData.text}
            onChange={handleInputChange}
            className="rounded-[12px] border border-primary-medium-gray px-[14px] py-3 w-full focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
        </label>
        
        <ButtonPrimary 
          type="submit" 
          className="text-white" 
          disabled={isDisabled}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <CircularProgress 
                size={20} 
                thickness={5}
                sx={{ color: 'white' }}
                className="text-white"
              />
              <span>Sending...</span>
            </span>
          ) : (
            'Send Message'
          )}
        </ButtonPrimary>
      </form>
    </>
  );
};
