import { useState } from "react";
import { ButtonPrimary } from "./ButtonPrimary";
import type { FeedbackInput } from "../types";
import { useSubmitFeedback } from "../hooks/useFeedback";
import { CircularProgress, Snackbar } from "@mui/material";
import { Textarea } from "./Textarea";
import { Input } from "./Input";

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
        <Input
          name="name"
          type="text"
          value={formData.name || ''}
          onChange={handleInputChange}
          placeholder="Your name"
          className="border-primary-medium-gray"
          labelClassName="text-primary-charcoal"
          required
        >
          Name
        </Input>
        
        <Input
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
          placeholder="you@example.com"
          className="border-primary-medium-gray"
          labelClassName="text-primary-charcoal"
          type="email"
          required
        >
          Email
        </Input>
        
        <Textarea
          name="text"
          value={formData.text}
          onChange={handleInputChange}
          placeholder="How can we help?"
          className="border-primary-medium-gray"
          labelClassName="text-primary-charcoal"
        >
          Message
        </Textarea>
        
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
