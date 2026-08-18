import React from 'react';
import { dummyShowsData } from '../assets/assets.js';
import MovieCard from '../components/MovieCard';

export default function Releases() {
  const releases = [...dummyShowsData].sort(
    (a, b) => new Date(b.release_date) - new Date(a.release_date)
  );

  return (
    <section className="themed-page releases-page">
      <div className="page-banner content">
        <span className="page-kicker">Discover Something New</span>
        <h1>Releases</h1>
        <p>Explore the newest titles in the VPCine collection and pick your next big-screen watch.</p>
      </div>

      <div className="content release-grid">
        {releases.map((movie) => (
          <div className="release-item" key={movie.id}>
            <MovieCard movie={movie} />
            <span className="release-date">
              Released {new Date(movie.release_date).toLocaleDateString('en-US', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
