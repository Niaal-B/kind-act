import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddActPage from '../components/Pages/AddActPage';
import { actsAPI, treeAPI } from '../services/api';

const AddActPageRoute = () => {
  const navigate = useNavigate();

  const handleSubmitAct = async (formData) => {
    try {
      const response = await actsAPI.create(formData);
      // Auto-decorate tree when act is created (signal handles this, but we can also call API)
      // The signal in backend will automatically create decoration, but we can refresh tree
      // Navigate to tree page to see the new decoration
      navigate('/my-tree', { replace: true });
    } catch (err) {
      console.error('Error submitting act:', err);
      throw err;
    }
  };

  return <AddActPage onSubmitAct={handleSubmitAct} />;
};

export default AddActPageRoute;

