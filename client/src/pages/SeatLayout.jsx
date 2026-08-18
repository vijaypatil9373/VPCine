import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, SignInButton } from '@clerk/react';
import { dummyShowsData, assets } from '../assets/assets.js';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MAX_VISIBLE_TIMINGS = 6;

const localDateKey = (value) => {
  const d = new Date(value);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function SeatLayout() {
  const { id, date } = useParams();
  const navigate = useNavigate();

  const { isSignedIn, user } = useUser();

  const movie =
    dummyShowsData.find(
      (item) => String(item.id) === String(id)
    ) || dummyShowsData[0];

  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  const [selectedSeats, setSelectedSeats] = useState([]);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [showsLoading, setShowsLoading] =
    useState(true);

  const rows = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
  ];

  useEffect(() => {
    const loadShows = async () => {
      try {
        setShowsLoading(true);

        let movieShows = [];

        /* =====================================
           1. Try movie specific API
        ====================================== */

        try {
          const response = await fetch(
            `${API_URL}/api/shows/movie/${id}`
          );

          if (response.ok) {
            const result = await response.json();

            if (Array.isArray(result)) {
              movieShows = result;
            }
          }
        } catch (error) {
          console.log(
            'Movie show endpoint fallback:',
            error
          );
        }

        /* =====================================
           2. Fallback to all shows
        ====================================== */

        if (movieShows.length === 0) {
          const response = await fetch(
            `${API_URL}/api/shows`
          );

          if (!response.ok) {
            throw new Error(
              'Could not load available shows'
            );
          }

          const allShows = await response.json();

          movieShows = allShows.filter((show) => {
            const showMovie = show.movie;

            return (
              String(showMovie?.tmdbId) ===
                String(id) ||
              String(showMovie?.id) ===
                String(id) ||
              String(showMovie?._id) ===
                String(id)
            );
          });
        }

        console.log(
          'Movie shows:',
          movieShows
        );

        /* =====================================
           3. Selected date shows
        ====================================== */

        const exactDateShows = movieShows.filter(
          (show) =>
            localDateKey(show.showDateTime) ===
            date
        );

        /* =====================================
           4. Sort + maximum 6 timings
        ====================================== */

        const availableShows = exactDateShows
          .sort(
            (a, b) =>
              new Date(a.showDateTime).getTime() -
              new Date(b.showDateTime).getTime()
          )
          .slice(0, MAX_VISIBLE_TIMINGS);

        console.log(
          'Available shows:',
          availableShows
        );

        setShows(availableShows);

        setSelectedShow(
          availableShows.length > 0
            ? availableShows[0]
            : null
        );

        setSelectedSeats([]);
      } catch (error) {
        console.error(
          'Failed to load shows:',
          error
        );

        setShows([]);
        setSelectedShow(null);
      } finally {
        setShowsLoading(false);
      }
    };

    loadShows();
  }, [id, date]);

  /* =====================================
     Seat Selection
  ====================================== */

  const toggleSeat = (seat) => {
    if (!selectedShow) return;

    const alreadyBooked =
      selectedShow.occupiedSeats?.[seat];

    if (alreadyBooked) return;

    setSelectedSeats((current) => {
      if (current.includes(seat)) {
        return current.filter(
          (selected) => selected !== seat
        );
      }

      if (current.length >= 5) {
        return current;
      }

      return [...current, seat];
    });
  };

  /* =====================================
     Change Timing
  ====================================== */

  const selectShow = (show) => {
    setSelectedShow(show);
    setSelectedSeats([]);
  };

  /* =====================================
     Time Formatter
  ====================================== */

  const formatTime = (value) => {
    return new Date(value).toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };

  /* =====================================
     Booking
  ====================================== */

  const handleBooking = async () => {
    if (
      !isSignedIn ||
      !selectedShow ||
      selectedSeats.length === 0
    ) {
      return;
    }

    try {
      setBookingLoading(true);

      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            userId: user.id,

            userName:
              user.fullName ||
              user.firstName ||
              user.primaryEmailAddress
                ?.emailAddress ||
              'VPCine User',

            showId: selectedShow._id,

            seats: selectedSeats,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || 'Booking failed'
        );

        return;
      }

      alert('Booking successful!');

      navigate('/my-bookings');
    } catch (error) {
      console.error(
        'Booking Error:',
        error
      );

      alert(
        'Something went wrong while booking.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  /* =====================================
     Loading
  ====================================== */

  if (showsLoading) {
    return (
      <section className="seat-page content">
        <h2>Loading shows...</h2>
      </section>
    );
  }

  return (
    <section className="seat-page content">

      {/* AVAILABLE TIMINGS */}

      <div className="time-panel">

        <h3>Available Timings</h3>

        {shows.length === 0 ? (
          <p>
            No shows available for this date.
          </p>
        ) : (
          shows.map((show) => (
            <button
              key={show._id}
              className={
                selectedShow?._id ===
                show._id
                  ? 'active'
                  : ''
              }
              onClick={() =>
                selectShow(show)
              }
            >
              ◷{' '}
              {formatTime(
                show.showDateTime
              )}
            </button>
          ))
        )}

      </div>

      {/* SEAT AREA */}

      <div className="seat-area">

        <h2>Select your seat</h2>

        <p>
          {movie.title}

          {date &&
            ` · ${new Date(
              `${date}T12:00:00`
            ).toDateString()}`}

          {selectedShow &&
            ` · ${formatTime(
              selectedShow.showDateTime
            )}`}
        </p>

        {/* SCREEN */}

        <div className="screen">

          <img
            src={assets.screenImage}
            alt="Cinema Screen"
          />

          <span>SCREEN SIDE</span>

        </div>

        {/* SEATS */}

        <div className="seats">

          {rows.map((row) => (

            <div
              className="seat-row"
              key={row}
            >

              <span>{row}</span>

              {Array.from(
                { length: 10 },
                (_, index) => {

                  const seat =
                    row + (index + 1);

                  const booked =
                    Boolean(
                      selectedShow
                        ?.occupiedSeats?.[
                        seat
                      ]
                    );

                  const selected =
                    selectedSeats.includes(
                      seat
                    );

                  return (
                    <button
                      key={seat}
                      disabled={
                        booked ||
                        !selectedShow
                      }
                      className={
                        booked
                          ? 'booked'
                          : selected
                          ? 'selected'
                          : ''
                      }
                      onClick={() =>
                        toggleSeat(seat)
                      }
                      title={
                        booked
                          ? 'Already booked'
                          : `Seat ${seat}`
                      }
                    >
                      {index + 1}
                    </button>
                  );
                }
              )}

            </div>

          ))}

        </div>

        {/* BOOKING BAR */}

        <div className="booking-bar">

          <span>
            {selectedSeats.length}{' '}
            seat
            {selectedSeats.length !== 1
              ? 's'
              : ''}{' '}
            selected
          </span>

          <b>
            $
            {selectedSeats.length *
              (selectedShow?.showPrice ||
                49)}
          </b>

          {!isSignedIn ? (

            <SignInButton mode="modal">

              <button
                className="primary"
                disabled={
                  !selectedSeats.length
                }
              >
                Login to Book →
              </button>

            </SignInButton>

          ) : (

            <button
              className="primary"
              disabled={
                !selectedSeats.length ||
                bookingLoading ||
                !selectedShow
              }
              onClick={handleBooking}
            >
              {bookingLoading
                ? 'Booking...'
                : 'Proceed to Book →'}
            </button>

          )}

        </div>

      </div>

    </section>
  );
}