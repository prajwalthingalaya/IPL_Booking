
import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from './supabase'

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
      <p>Book your IPL tickets and support your favourite team.</p>
      <a href="#matches" className="hero-button">Explore Matches</a>
    </section>
  )
}

function MatchCard({ match, onSelect }) {
  return (
    <div className="match-card">
      <h3>{match.team1} vs {match.team2}</h3>
      <p>Date: {match.match_date}</p>
      <p>Time: {match.match_time}</p>
      <p>Venue: {match.venue}</p>
      <p>Available Seats: {match.available_seats}</p>
      <button
        onClick={() => onSelect(match)}
        disabled={match.available_seats === 0}
      >
        {match.available_seats === 0 ? 'Sold Out' : 'Book Tickets'}
      </button>
    </div>
  )
}

function App() {
  const [matches, setMatches] = useState([])
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [tickets, setTickets] = useState(1)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchMatches()

    const channel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        () => {
          fetchMatches()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('id')

    if (error) {
      setMessage('Unable to load matches: ' + error.message)
    } else {
      setMatches(data)
      setSelectedMatch(current => {
        if (!current) return null
        return data.find(match => match.id === current.id) || null
      })
    }

    setLoading(false)
  }

  async function handleBooking(event) {
    event.preventDefault()
    setMessage('')

    if (!selectedMatch) {
      setMessage('Please select a match.')
      return
    }

    const quantity = Number(tickets)

    if (!customerName.trim() || !email.trim()) {
      setMessage('Please enter your name and email.')
      return
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      setMessage('Please enter a valid ticket quantity.')
      return
    }

    if (quantity > selectedMatch.available_seats) {
      setMessage('Not enough seats are available.')
      return
    }

    setBookingLoading(true)

    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          match_id: selectedMatch.id,
          customer_name: customerName.trim(),
          email: email.trim(),
          tickets: quantity
        }
      ])

    if (bookingError) {
      setMessage('Booking failed: ' + bookingError.message)
      setBookingLoading(false)
      return
    }

    const { data: updatedMatch, error: updateError } = await supabase
      .from('matches')
      .update({
        available_seats: selectedMatch.available_seats - quantity
      })
      .eq('id', selectedMatch.id)
      .select()
      .single()

    if (updateError) {
      setMessage('Booking was saved, but seat update failed: ' + updateError.message)
      await fetchMatches()
      setBookingLoading(false)
      return
    }

    setMatches(current =>
      current.map(match =>
        match.id === updatedMatch.id ? updatedMatch : match
      )
    )

    setSelectedMatch(updatedMatch)
    setMessage('Booking successful! Your tickets have been saved.')
    setCustomerName('')
    setEmail('')
    setTickets(1)
    setBookingLoading(false)
  }

  return (
    <>
      <Navbar />
      <Hero />

      <section className="matches" id="matches">
        <h2>Upcoming Matches</h2>

        {loading ? (
          <p>Loading matches...</p>
        ) : matches.length === 0 ? (
          <p>No matches found.</p>
        ) : (
          <div className="match-container">
            {matches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                onSelect={setSelectedMatch}
              />
            ))}
          </div>
        )}
      </section>

      <section className="booking" id="booking">
        <h2>Ticket Booking</h2>

        {selectedMatch ? (
          <>
            <h3>{selectedMatch.team1} vs {selectedMatch.team2}</h3>
            <p>Date: {selectedMatch.match_date}</p>
            <p>Venue: {selectedMatch.venue}</p>
            <p>Available Seats: {selectedMatch.available_seats}</p>

            <form onSubmit={handleBooking}>
              <label>Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={event => setCustomerName(event.target.value)}
                required
              />

              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
              />

              <label>Number of Tickets</label>
              <input
                type="number"
                min="1"
                max={selectedMatch.available_seats}
                value={tickets}
                onChange={event => setTickets(event.target.value)}
                required
              />

              <button
                type="submit"
                disabled={bookingLoading || selectedMatch.available_seats === 0}
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </>
        ) : (
          <p>Select a match above to book tickets.</p>
        )}

        {message && <p>{message}</p>}
      </section>
    </>
  )
}

export default App
