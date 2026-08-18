import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyShowsData } from '../assets/assets.js';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const localDateKey = (value) => {
  const d = new Date(value);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie =
    dummyShowsData.find(
      (item) => String(item.id) === String(id)
    ) || dummyShowsData[0];

  const [availableDates, setAvailableDates] = useState([]);
  const [datesLoading, setDatesLoading] = useState(true);

  useEffect(() => {
    const loadAvailableDates = async () => {
      try {
        setDatesLoading(true);

        let movieShows = [];

        // First try movie specific API
        try {
          const response = await fetch(
            `${API_URL}/api/shows/movie/${id}`
          );

          if (response.ok) {
            const data = await response.json();

            if (Array.isArray(data)) {
              movieShows = data;
            }
          }
        } catch (error) {
          console.log('Movie show API fallback:', error);
        }

        // Fallback to all shows
        if (movieShows.length === 0) {
          const response = await fetch(
            `${API_URL}/api/shows`
          );

          if (!response.ok) {
            throw new Error('Could not load shows');
          }

          const allShows = await response.json();

          movieShows = allShows.filter((show) => {
            return (
              String(show.movie?.tmdbId) === String(id) ||
              String(show.movie?.id) === String(id)
            );
          });
        }

        // Get unique dates
        const uniqueDates = [
          ...new Set(
            movieShows.map((show) =>
              localDateKey(show.showDateTime)
            )
          ),
        ];

        // Sort dates and show only first 5
        const sortedDates = uniqueDates
          .sort(
            (a, b) =>
              new Date(`${a}T12:00:00`) -
              new Date(`${b}T12:00:00`)
          )
          .slice(0, 5);

        setAvailableDates(sortedDates);
      } catch (error) {
        console.error(
          'Failed to load available dates:',
          error
        );

        setAvailableDates([]);
      } finally {
        setDatesLoading(false);
      }
    };

    loadAvailableDates();
  }, [id]);

  return (
    <section className="details-page">

      <div
        className="backdrop"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              #09090b 5%,
              rgba(9,9,11,.55),
              #09090b 98%
            ),
            url(${movie.backdrop_path})
          `,
        }}
      />

      <div className="details content">

        <img
          className="poster"
          src={movie.poster_path}
          alt={movie.title}
        />

        <div className="details-copy">

          <span className="pink">
            {movie.original_language?.toUpperCase() || 'EN'}
          </span>

          <h1>{movie.title}</h1>

          <div className="rating">
            ★ {movie.vote_average?.toFixed(1)} User Rating
          </div>

          <p>{movie.overview}</p>

          <p>
            {movie.runtime} mins ·{' '}
            {movie.genres
              ?.map((genre) => genre.name)
              .join(', ')}{' '}
            · {new Date(movie.release_date).getFullYear()}
          </p>

          <div className="actions">

            <button className="ghost">
              ▶ Watch Trailer
            </button>

            <button
              className="primary"
              onClick={() =>
                document
                  .getElementById('dates')
                  ?.scrollIntoView({
                    behavior: 'smooth',
                  })
              }
            >
              Buy Tickets
            </button>

            <button className="heart">
              ♡
            </button>

          </div>
        </div>
      </div>

      <div className="cast content">

        <h2>Your Favorite Cast</h2>

        <div className="cast-row">
          {movie.casts?.slice(0, 10).map((cast, index) => (
            <div key={index}>

              <img
                src={cast.profile_path}
                alt={cast.name}
              />

              <span>{cast.name}</span>

            </div>
          ))}
        </div>
      </div>

      <div
        id="dates"
        className="date-box content"
      >
        <h2>Choose Date</h2>

        {datesLoading ? (
          <p>Loading available dates...</p>
        ) : availableDates.length === 0 ? (
          <p>No dates available for this movie.</p>
        ) : (
          <div className="date-picker">

            {availableDates.map((date) => {
              const displayDate = new Date(
                `${date}T12:00:00`
              );

              return (
                <button
                  key={date}
                  onClick={() =>
                    navigate(
                      `/movies/${movie.id}/${date}`
                    )
                  }
                >
                  <b>
                    {displayDate.toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                      }
                    )}
                  </b>

                  <span>
                    {displayDate.getDate()}
                  </span>
                </button>
              );
            })}

          </div>
        )}
      </div>

    </section>
  );
}