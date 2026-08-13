import { useState } from "react";
import type { FeedbackInput } from "../types";
import { useSubmitFeedback } from "../hooks/useFeedback";
import { ButtonPrimary } from "./ButtonPrimary";
import Snackbar from "@mui/material/Snackbar";
import { CircularProgress } from "@mui/material";

export const FormFeedback: React.FC = () => {
  const { submitFeedback, loading } = useSubmitFeedback();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contactMe, setContactMe] = useState(true);
  const [anonymous, setAnonymous] = useState(false);
  const [formData, setFormData] = useState<FeedbackInput>({
    text: '',
    email: null,
    name: null
  });

  const isDisabled = 
    loading || 
    formData.text.trim() === '' ||
    (contactMe && !formData.email?.trim()) ||
    (!anonymous && !formData.name?.trim());

  // Handle input changes
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
    if (isDisabled) return;

    try {
      const mutationResponse = await submitFeedback(formData);
      setIsSubmitted(mutationResponse?.success || false);
      
      setFormData({
        text: '',
        email: null,
        name: null
      });
      setContactMe(true);
      setAnonymous(false);
      console.log('Feedback submitted');
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
        message="Thank you, we received your feedback!"
        key="topright"
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: 'white',
            color: 'gray',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
            paddingBlock: '1rem',
            paddingInline: '2rem',
            width: '30rem'
          },
        }}
      />
      
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm text-primary-medium-gray">
          Feedback
          <textarea 
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            placeholder="How was your experience?" 
            rows={5} 
            className="rounded-[12px] border border-primary-charcoal px-[14px] py-3 w-full bg-primary-deep-blue text-white"
          />
        </label>
        
        <div className={`grid grid-cols-2 gap-4 ${!contactMe && anonymous ? 'h-28' : ''}`}>
          <div className={`grid gap-3 ${!contactMe ? 'h-8' : ''}`}>
            <label className="flex items-center gap-2 text-sm text-primary-medium-gray">
              <input
                type="checkbox"
                checked={contactMe}
                onChange={(event) => setContactMe(event.target.checked)}
                className="accent-accent-purple"
              />
              Contact me
            </label>
            <label className="grid gap-2 text-sm text-primary-medium-gray">
              Email
              <input 
                name="email"
                required={contactMe}
                value={formData.email || ''}
                onChange={handleInputChange}
                type="email" 
                placeholder="you@example.com" 
                className={`rounded-[12px] border border-primary-charcoal px-[14px] py-3 w-full bg-primary-deep-blue text-white ${contactMe ? 'visible mb-1.5' : 'hidden'}`}
              />
            </label>
          </div>
          
          <div className={`grid gap-3 ${anonymous ? 'h-8' : ''}`}>
            <label className="flex items-center gap-2 text-sm text-primary-medium-gray">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(event) => setAnonymous(event.target.checked)}
                className="accent-accent-purple"
              />
              Anonymous
            </label>
            <label className="grid gap-2 text-sm text-primary-medium-gray">
              Name
              <input 
                name="name"
                required={!anonymous}
                value={formData.name || ''}
                onChange={handleInputChange}
                type="text" 
                placeholder="Your name" 
                className={`rounded-[12px] border border-primary-charcoal px-[14px] py-3 w-full bg-primary-deep-blue text-white ${anonymous ? 'hidden' : 'visible mb-1.5'}`}
              />
            </label>
          </div>
        </div>
        
        <ButtonPrimary type="submit" disabled={isDisabled}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <CircularProgress 
                size={20} 
                thickness={5}
                sx={{ 
                  color: 'var(--color-primary-deep-blue)',
                }}
                className="text-primary-deep-blue"
              />
              <span>Submitting...</span>
            </span>
          ) : (
            'Submit Feedback'
          )}
        </ButtonPrimary>
      </form>
    </>
  );
};

