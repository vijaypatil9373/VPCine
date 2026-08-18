import React from 'react';

const theaters = [
  { name: 'VPCine City Center', area: 'Central Mall', screens: 6, format: 'Dolby Atmos', price: 180 },
  { name: 'VPCine Phoenix', area: 'Market City', screens: 8, format: '4K Laser', price: 220 },
  { name: 'VPCine Grand Mall', area: 'Downtown', screens: 5, format: 'Dolby Atmos', price: 170 },
  { name: 'VPCine IMAX', area: 'Metro Plaza', screens: 7, format: 'IMAX', price: 260 },
  { name: 'VPCine Riverside', area: 'Riverfront', screens: 4, format: '4K Digital', price: 160 },
  { name: 'VPCine Luxe', area: 'Premium Square', screens: 5, format: 'Recliner', price: 290 },
];

export default function Theaters() {
  return (
    <section className="themed-page theaters-page">
      <div className="page-banner content">
        <span className="page-kicker">VPCine Near You</span>
        <h1>Theaters</h1>
        <p>Choose a cinema, compare formats and find the right screen for your next movie.</p>
      </div>

      <div className="content theater-grid">
        {theaters.map((theater) => (
          <article className="theater-card" key={theater.name}>
            <div className="theater-icon">🎬</div>
            <div>
              <h2>{theater.name}</h2>
              <p>{theater.area}</p>
              <div className="theater-tags">
                <span>{theater.screens} Screens</span>
                <span>{theater.format}</span>
                <span>Parking</span>
              </div>
            </div>
            <strong>From ${theater.price}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
