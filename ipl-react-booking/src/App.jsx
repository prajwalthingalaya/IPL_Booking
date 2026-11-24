import { useState } from 'react'
import './App.css'

function Navbar() {
  return (
    <nav className="navbar">
      <h2>IPL TICKETS</h2>
      <div>
        <a href="#home">Home</a>
        <a href="#matches">Matches</a>
        <a href="#booking">Booking</a>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="hero" id="home">
      <h1>Experience The Stadium Energy Live!</h1>
      <p>Book your IPL 2026 tickets and support your favourite team.</p>
      <a href="#matches" className="hero-button">Explore Matches</a>
    </section>
  )
}

function MatchCard({ match, onSelect }) {
  return (
    <div className="match-card">
      <h3>{match.team1} vs {match.team2}</h3>
      <p>Date: {match.date}</p>
      <p>Time: {match.time}</p>
      <p>Venue: {match.venue}</p>
      <button onClick={() => onSelect(match)}>Book Tickets</button>
    </div>
  )
}

function App() {
  const [selectedMatch, setSelectedMatch] = useState(null)

  const matches = [
    { id: 1, team1: 'RCB', team2: 'MI', date: '10 April 2026', time: '7:30 PM', venue: 'Bengaluru' },
    { id: 2, team1: 'CSK', team2: 'KKR', date: '12 April 2026', time: '7:30 PM', venue: 'Chennai' },
    { id: 3, team1: 'RR', team2: 'GT', date: '15 April 2026', time: '7:30 PM', venue: 'Jaipur' },
    { id: 4, team1: 'PBKS', team2: 'RCB', date: '18 April 2026', time: '3:30 PM', venue: 'Chandigarh' },
    { id: 5, team1: 'RR', team2: 'CSK', date: '20 April 2026', time: '7:30 PM', venue: 'Jaipur' }
  ]

  return (
    <>
      <Navbar />
      <Hero />

      <section className="matches" id="matches">
        <h2>Upcoming Matches</h2>
        <div className="match-container">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelect={setSelectedMatch}
            />
          ))}
        </div>
      </section>

      <section className="booking" id="booking">
        <h2>Booking Selection</h2>
        {selectedMatch ? (
          <div>
            <h3>{selectedMatch.team1} vs {selectedMatch.team2}</h3>
            <p>Selected Venue: {selectedMatch.venue}</p>
            <p>Date: {selectedMatch.date}</p>
            <p>Your match has been selected!</p>
          </div>
        ) : (
          <p>Select a match above to see your booking selection.</p>
        )}
      </section>
    </>
  )
}

export default App