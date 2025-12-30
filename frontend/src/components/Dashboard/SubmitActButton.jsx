import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SubmissionForm from '../Forms/SubmissionForm';
import './SubmitActButton.css';

const SubmitActButton = ({ onSubmitAct }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button 
        className="submit-act-button" 
        onClick={() => setShowForm(true)}
        title="Submit an Act of Kindness"
      >
        <Plus size={24} />
        <span>Submit Act</span>
      </button>
      
      {showForm && (
        <div className="submission-form-overlay" onClick={() => setShowForm(false)}>
          <div className="submission-form-container" onClick={(e) => e.stopPropagation()}>
            <SubmissionForm
              onSubmit={async (data) => {
                await onSubmitAct(data);
                setShowForm(false);
              }}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitActButton;

