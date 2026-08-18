import React from 'react';
import { Link } from 'react-router-dom';
import { dummyShowsData, dummyTrailers } from '../assets/assets.js';
import MovieCard from '../components/MovieCard';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-overlay">
          <span className="hero-kicker">YOUR MOVIE EXPERIENCE, ELEVATED</span>
          <h1>
            Book Movies<br />
            The <span>Smart</span> Way
          </h1>
          <p className="hero-copy">
            Discover great movies, choose a convenient showtime and reserve your favorite seats in just a few clicks.
          </p>
          <div className="hero-actions">
            <Link to="/movies" className="primary">Explore Movies →</Link>
            <a href="#now-showing" className="ghost hero-ghost">Now Showing</a>
          </div>
        </div>
      </section>

      <section className="content" id="now-showing">
        <div className="section-head">
          <h2>Now Showing</h2>
          <Link to="/movies">View All →</Link>
        </div>

        <div className="movie-grid">
          {dummyShowsData.slice(0, 4).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <div className="center">
          <Link to="/movies" className="primary">Show more</Link>
        </div>

        <h2 className="trailer-title">Trailers</h2>
        <div
          className="trailer-main"
          style={{ backgroundImage: `url(${dummyTrailers[0].image})` }}
        >
          <a href={dummyTrailers[0].videoUrl} target="_blank" rel="noreferrer">▶</a>
        </div>

        <div className="trailer-row">
          {dummyTrailers.map((trailer, index) => (
            <a href={trailer.videoUrl} target="_blank" rel="noreferrer" key={index}>
              <img src={trailer.image} alt={`Trailer ${index + 1}`} />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
