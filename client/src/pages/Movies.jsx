import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { dummyShowsData } from '../assets/assets.js';

export default function Movies() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get('search') || '';

  const filteredMovies = dummyShowsData.filter((movie) =>
    movie.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="page content">

      <h1>
        {search
          ? `Search Results for "${search}"`
          : 'Now Showing'}
      </h1>

      {filteredMovies.length > 0 ? (
        <div className="movie-grid all">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px'
          }}
        >
          <h2>Movie not found</h2>
          <p>
            No movie found for "{search}"
          </p>
        </div>
      )}

    </section>
  );
}