import React from 'react';
import SubmissionForm from '../Forms/SubmissionForm';
import './AddActPage.css';

const AddActPage = ({ onSubmitAct }) => {
  return (
    <div className="add-act-page">
      <div className="add-act-container">
        <div className="add-act-header">
          <h2>Share Your Act of Kindness</h2>
          <p>Help spread the Christmas spirit by sharing how you've made a difference in your community</p>
        </div>
        
        <div className="add-act-form-wrapper">
          <SubmissionForm
            onSubmit={async (data) => {
              await onSubmitAct(data);
              // Form will reset after successful submission
            }}
            onClose={undefined}
            hideHeader={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AddActPage;

