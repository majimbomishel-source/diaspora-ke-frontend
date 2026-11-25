import { useState } from 'react';
import './App.css';

function App() {
  const [lightsOn, setLightsOn] = useState(false);
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('discover'); 

  // Discover State
  const [searchCity, setSearchCity] = useState('London');
  const [searchResults, setSearchResults] = useState([]);

  // Auth States
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', full_name: '', current_city: 'London', current_country: 'UK' });

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Login Successful!');
        localStorage.setItem('token', data.token);
        setUser(data.user); 
      } else { alert(data.error); }
    } catch (err) { alert('Failed to connect to server.'); }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registration Successful! Pull the cord to log in.');
        setLightsOn(false); 
      } else { alert(data.error); }
    } catch (err) { alert('Failed to connect to server.'); }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/users/discover?city=${searchCity}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) { setSearchResults(data.users); } else { alert(data.error); }
    } catch (err) { alert('Search failed.'); }
  };

  const handleConnect = async (receiverId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/connections', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ receiver_id: receiverId })
      });
      const data = await res.json();
      if (res.ok) { alert('Connection request sent successfully!'); } 
      else { alert(data.error || 'Failed to send request.'); }
    } catch (err) { alert('Failed to send request.'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSearchResults([]);
  };

  // --- DASHBOARD ---
  if (user) {
    return (
      <div className="dashboard">
        <nav className="navbar">
          <h2>Diaspora KE</h2>
          <div>
            <span>Welcome, {user.full_name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </nav>

        {/* TABS */}
        <div className="tabs">
          <button className={activeTab === 'discover' ? 'active' : ''} onClick={() => setActiveTab('discover')}>Discover People</button>
          <button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => setActiveTab('jobs')}>Job Opportunities</button>
          <button className={activeTab === 'ambassadors' ? 'active' : ''} onClick={() => setActiveTab('ambassadors')}>Ambassadors</button>
          <button className={activeTab === 'language' ? 'active' : ''} onClick={() => setActiveTab('language')}>Language Exchange</button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>My Profile</button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'discover' && (
            <>
              <h1>Find Kenyans Abroad</h1>
              <div className="search-bar">
                <input type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} placeholder="Enter city (e.g., London)" />
                <button onClick={handleSearch}>Search</button>
              </div>
              <div className="results-grid">
                {searchResults.map((person) => (
                  <div key={person.id} className="user-card">
                    <h3>{person.full_name}</h3>
                    <p>📍 {person.current_city}, {person.current_country}</p>
                    <button className="connect-btn" onClick={() => handleConnect(person.id)}>Connect</button>
                  </div>
                ))}
                {searchResults.length === 0 && <p>No users found in this city yet.</p>}
              </div>
            </>
          )}

          {activeTab === 'jobs' && (
            <div className="placeholder-tab">
              <h1>💼 Job Opportunities</h1>
              <p>Find work, internships, and business opportunities within the diaspora.</p>
              <div className="mock-card">
                <h3>Software Engineer - London</h3>
                <p>Posted by: Tech Diaspora UK</p>
                <button>Apply Now</button>
              </div>
            </div>
          )}

          {activeTab === 'ambassadors' && (
            <div className="placeholder-tab">
              <h1>🏛️ Community Ambassadors</h1>
              <p>Connect with verified leaders and organizers in your city.</p>
              <div className="mock-card">
                <h3>Jane Doe - Ambassador (London)</h3>
                <p>Organizes monthly Kenyan meetups.</p>
                <button>Contact</button>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="placeholder-tab">
              <h1>🗣️ Language Exchange</h1>
              <p>Teach Swahili or learn a new language from a fellow Kenyan.</p>
              <div className="mock-card">
                <h3>Learn Swahili with David</h3>
                <p>David is offering 1-on-1 Swahili lessons.</p>
                <button>Join Class</button>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="placeholder-tab">
              <h1>⚙️ Update Your Profile</h1>
              <p>Tell the community about your skills and interests.</p>
              <div className="mock-card">
                <input type="text" placeholder="Home County (e.g., Nairobi)" id="countyInput" style={{marginBottom: '1rem', padding: '0.5rem', width: '100%'}} />
                <input type="text" placeholder="Interests (comma separated)" id="interestsInput" style={{marginBottom: '1rem', padding: '0.5rem', width: '100%'}} />
                <button onClick={async () => {
                  const county = document.getElementById('countyInput').value;
                  const interests = document.getElementById('interestsInput').value.split(',');
                  const token = localStorage.getItem('token');
                  
                  const res = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ home_county: county, interests: interests })
                  });
                  if(res.ok) alert('Profile Saved!');
                  else alert('Error saving profile');
                }}>Save Profile</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- LAMP LOGIN ---
  return (
    <div className={`room ${lightsOn ? 'lights-on' : 'lights-off'}`}>
      <div className="lamp-container">
        <div className="cord" onClick={() => setLightsOn(!lightsOn)}>
          <div className="cord-line"></div>
          <div className="lamp-bulb"></div>
          <div className="pull-ring"></div>
        </div>
        <p className="click-hint">Pull the ring!</p>
      </div>

      <div className="form-container">
        {!lightsOn ? (
          <form className="form-box login-form" onSubmit={handleLoginSubmit}>
            <h2>Welcome Back</h2>
            <p>Login to Diaspora KE</p>
            <input type="email" name="email" placeholder="Email" onChange={handleLoginChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleLoginChange} required />
            <button type="submit">Login</button>
          </form>
        ) : (
          <form className="form-box register-form" onSubmit={handleRegisterSubmit}>
            <h2>Join the Community</h2>
            <p>Create your Diaspora KE account</p>
            <input type="text" name="full_name" placeholder="Full Name" onChange={handleRegisterChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleRegisterChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleRegisterChange} required />
            <button type="submit">Register</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;