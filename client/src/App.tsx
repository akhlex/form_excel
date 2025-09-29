
import { useState } from 'react';
import './App.css';
import RegistrationForm from './components/RegistrationForm';
import './components/RegistrationForm.css';

const EVENT_TITLE = 'TechFest 2025';
const EVENT_SUBTITLE = 'Annual Technology Festival';

function App() {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="App">
      <header className="hero-header">
        <div className="hero-overlay">
          <h1>{EVENT_TITLE}</h1>
          <p>{EVENT_SUBTITLE}</p>
          <button className="cta-button" onClick={() => setShowRegistration(true)}>Register Now</button>
        </div>
      </header>
      <main className="main-content">
        <div className="content-columns">
          <section className="main-sections">
            <div className="card">
              <h2>About the Event</h2>
              <p>Join us for TechFest 2025, the premier technology festival showcasing innovation, creativity, and technological excellence. Experience three days of exciting competitions, workshops, and presentations from industry leaders.</p>
            </div>
            
            <div className="card">
              <h2>Event Highlights</h2>
              <ul>
                <li>Hackathon Challenge</li>
                <li>AI/ML Workshop Series</li>
                <li>Tech Talks by Industry Experts</li>
                <li>Project Exhibition</li>
                <li>Gaming Tournament</li>
              </ul>
            </div>
            
            <div className="card">
              <h2>Schedule</h2>
              <ul>
                <li>Day 1: Opening Ceremony & Workshops</li>
                <li>Day 2: Competitions & Exhibition</li>
                <li>Day 3: Tech Talks & Prize Distribution</li>
              </ul>
            </div>
          </section>
          
          <aside className="sidebar">
            <div className="card">
              <h2>Registration Info</h2>
              <ul>
                <li>Early Bird: ₹499</li>
                <li>Regular: ₹799</li>
                <li>Team Registration: ₹1999</li>
              </ul>
            </div>
            
            <div className="card">
              <h2>Important Dates</h2>
              <ul>
                <li>Registration Opens: Oct 1, 2025</li>
                <li>Early Bird Deadline: Oct 15, 2025</li>
                <li>Event Dates: Nov 1-3, 2025</li>
              </ul>
            </div>
          </aside>
        </div>
        {showRegistration && (
          <div className="registration-overlay">
            <div className="registration-modal">
              <button className="close-button" onClick={() => setShowRegistration(false)}>×</button>
              <RegistrationForm />
            </div>
          </div>
        )}
      </main>
      <footer className="main-footer">
        <p>&copy; 2025 TechFest - All Rights Reserved</p>
        <p>Organized by Student Technical Committee</p>
        <p>Contact: <a href="mailto:techfest2025@example.com">techfest2025@example.com</a> | Phone: +91 9876543210</p>
      </footer>
    </div>
  );
}

export default App;
            <h2>Register</h2>
