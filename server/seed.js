import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Movie from './models/Movie.js';
import Show from './models/Show.js';

dotenv.config();

const movies = [
  {
    tmdbId: 324544,
    title: 'In the Lost Lands',
    overview:
      'A queen sends the powerful and feared sorceress Gray Alys to the ghostly wilderness of the Lost Lands in search of a magical power.',
    poster_path:
      'https://image.tmdb.org/t/p/original/dDlfjR7gllmr8HTeN6rfrYhTdwX.jpg',
    backdrop_path:
      'https://image.tmdb.org/t/p/original/op3qmNhvwEvyT7UFyPbIfQmKriB.jpg',
    genres: [
      { id: 28, name: 'Action' },
      { id: 14, name: 'Fantasy' },
      { id: 12, name: 'Adventure' }
    ],
    release_date: '2025-02-27',
    original_language: 'en',
    tagline: 'She seeks the power to free her people.',
    vote_average: 6.4,
    runtime: 102
  },

  {
    tmdbId: 1232546,
    title: 'Until Dawn',
    overview:
      'One year after her sister mysteriously disappeared, Clover and her friends head into the remote valley in search of answers.',
    poster_path:
      'https://image.tmdb.org/t/p/original/juA4IWO52Fecx8lhAsxmDgy3M3.jpg',
    backdrop_path:
      'https://image.tmdb.org/t/p/original/icFWIk1KfkWLZnugZAJEDauNZ94.jpg',
    genres: [
      { id: 27, name: 'Horror' },
      { id: 9648, name: 'Mystery' }
    ],
    release_date: '2025-04-23',
    original_language: 'en',
    tagline: 'Every night a different nightmare.',
    vote_average: 6.405,
    runtime: 103
  },

  {
    tmdbId: 552524,
    title: 'Lilo & Stitch',
    overview:
      'The wildly funny and touching story of a lonely Hawaiian girl and the fugitive alien who helps to mend her broken family.',
    poster_path:
      'https://image.tmdb.org/t/p/original/mKKqV23MQ0uakJS8OCE2TfV5jNS.jpg',
    backdrop_path:
      'https://image.tmdb.org/t/p/original/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg',
    genres: [
      { id: 10751, name: 'Family' },
      { id: 35, name: 'Comedy' },
      { id: 878, name: 'Science Fiction' }
    ],
    release_date: '2025-05-17',
    original_language: 'en',
    tagline: 'Hold on to your coconuts.',
    vote_average: 7.117,
    runtime: 108
  },

  {
    tmdbId: 668489,
    title: 'Havoc',
    overview:
      'When a drug heist swerves lethally out of control, a jaded cop fights his way through a corrupt city criminal underworld.',
    poster_path:
      'https://image.tmdb.org/t/p/original/ubP2OsF3GlfqYPvXyLw9d78djGX.jpg',
    backdrop_path:
      'https://image.tmdb.org/t/p/original/65MVgDa6YjSdqzh7YOA04mYkioo.jpg',
    genres: [
      { id: 28, name: 'Action' },
      { id: 80, name: 'Crime' },
      { id: 53, name: 'Thriller' }
    ],
    release_date: '2025-04-25',
    original_language: 'en',
    tagline: 'No law. Only disorder.',
    vote_average: 6.537,
    runtime: 107
  },

  {
    tmdbId: 950387,
    title: 'A Minecraft Movie',
    overview:
      'Four misfits are pulled through a mysterious portal into the Overworld and must master the strange world to find their way home.',
    poster_path:
      'https://image.tmdb.org/t/p/original/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg',
    backdrop_path:
      'https://image.tmdb.org/t/p/original/2Nti3gYAX513wvhp8IiLL6ZDyOm.jpg',
    genres: [
      { id: 10751, name: 'Family' },
      { id: 35, name: 'Comedy' },
      { id: 12, name: 'Adventure' },
      { id: 14, name: 'Fantasy' }
    ],
    release_date: '2025-03-31',
    original_language: 'en',
    tagline: 'Be there and be square.',
    vote_average: 6.516,
    runtime: 101
  },

  {
    tmdbId: 575265,
    title: 'Mission: Impossible - The Final Reckoning',
    overview:
      'Ethan Hunt and his team continue their search for the powerful AI known as the Entity.',
    poster_path:
      'https://image.tmdb.org/t/p/original/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg',
    backdrop_path:
      'https://image.tmdb.org/t/p/original/1p5aI299YBnqrEEvVGJERk2MXXb.jpg',
    genres: [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 53, name: 'Thriller' }
    ],
    release_date: '2025-05-17',
    original_language: 'en',
    tagline: 'Our lives are the sum of our choices.',
    vote_average: 7.042,
    runtime: 170
  },

  {
    tmdbId: 986056,
    title: 'Thunderbolts*',
    overview:
      'Seven disillusioned castoffs embark on a dangerous mission that forces them to confront their pasts.',
    poster_path:
      'https://image.tmdb.org/t/p/original/m9EtP1Yrzv6v7dMaC9mRaGhd1um.jpg',
    backdrop_path:
      'https://image.tmdb.org/t/p/original/rthMuZfFv4fqEU4JVbgSW9wQ8rs.jpg',
    genres: [
      { id: 28, name: 'Action' },
      { id: 878, name: 'Science Fiction' },
      { id: 12, name: 'Adventure' }
    ],
    release_date: '2025-04-30',
    original_language: 'en',
    tagline: 'Everyone deserves a second shot.',
    vote_average: 7.443,
    runtime: 127
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected');

    // WARNING:
    // This clears existing shows and movies.
    await Show.deleteMany({});
    await Movie.deleteMany({});

    console.log('Old movies and shows removed');

    let totalShows = 0;

    // Show timings
    const timings = [
      { hour: 10, minute: 30 },
      { hour: 13, minute: 0 },
      { hour: 16, minute: 0 },
      { hour: 19, minute: 30 },
      { hour: 22, minute: 30 }
    ];

    for (const movieData of movies) {
      const movie = await Movie.create(movieData);

      // Create shows for today + next 29 days
      for (let day = 0; day < 30; day++) {
        for (const timing of timings) {
          const showDate = new Date();

          showDate.setDate(showDate.getDate() + day);

          showDate.setHours(
            timing.hour,
            timing.minute,
            0,
            0
          );

          await Show.create({
            movie: movie._id,
            showDateTime: showDate,
            showPrice: 49,
            occupiedSeats: {}
          });

          totalShows++;
        }
      }

      console.log(`Created shows for: ${movie.title}`);
    }

    console.log('');
    console.log('==============================');
    console.log('VPCine Database Seed Complete');
    console.log('==============================');
    console.log(`Movies: ${movies.length}`);
    console.log(`Shows: ${totalShows}`);
    console.log('==============================');

    await mongoose.disconnect();

    console.log('MongoDB disconnected');

    process.exit(0);

  } catch (error) {
    console.error('Seed Error:', error);

    try {
      await mongoose.disconnect();
    } catch {
      // ignore disconnect error
    }

    process.exit(1);
  }
};

seedDatabase();