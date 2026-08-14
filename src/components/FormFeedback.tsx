import { useState } from "react";
import type { FeedbackInput } from "../types";
import { useSubmitFeedback } from "../hooks/useFeedback";
import { ButtonPrimary } from "./ButtonPrimary";
import Snackbar from "@mui/material/Snackbar";
import { CircularProgress } from "@mui/material";
import { Textarea } from "./Textarea";
import { Input } from "./Input";
import { Checkbox } from "./Checkbox";

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
        <Textarea
          name="text"
          value={formData.text}
          onChange={handleInputChange}
          placeholder="How was your experience?"
          className="border-primary-charcoal bg-primary-deep-blue text-white"
          labelClassName="text-primary-medium-gray"
        >
          Feedback
        </Textarea>
        
        <div className={`grid grid-cols-2 gap-4 ${!contactMe && anonymous ? 'h-28' : ''}`}>
          <div className={`grid gap-3 ${!contactMe ? 'h-8' : ''}`}>
            <Checkbox
              checked={contactMe}
              onChange={setContactMe}
              label="Contact me"
              className="accent-accent-purple"
              labelClassName="text-primary-medium-gray"
            />

            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email || ''}
              onChange={handleInputChange}
              className={`border-primary-charcoal  bg-primary-deep-blue text-white ${contactMe ? 'visible mb-1.5' : 'hidden'}`}
              labelClassName="text-primary-medium-gray"
              required={contactMe}
            >
              Email
            </Input>
          </div>
          
          <div className={`grid gap-3 ${anonymous ? 'h-8' : ''}`}>
            <Checkbox
              checked={anonymous}
              onChange={setAnonymous}
              label="Anonymous"
              className="accent-accent-purple"
              labelClassName="text-primary-medium-gray"
            />
            
            <Input
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className={`border-primary-charcoal bg-primary-deep-blue text-white ${anonymous ? 'hidden' : 'visible mb-1.5'}`}
              labelClassName="text-primary-medium-gray"
              required={!anonymous}
            >
              Name
            </Input>
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

