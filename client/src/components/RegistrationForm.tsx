import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Sending form data:', formData);
      const response = await fetch('https://form-excel-backend.vercel.app/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Registration successful!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
    } catch (err) {
      const error = err as Error;
      alert(error.message || 'Error submitting registration. Please try again.');
      console.error('Registration error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="registration-form-container">
      <h2>Event Registration</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Full Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Enter your complete address"
            style={{ width: '100%' }}
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Registration
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;