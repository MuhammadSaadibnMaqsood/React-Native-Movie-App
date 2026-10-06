# MovieApp

MovieApp is an Expo + React Native mobile application for browsing movies using the TMDB API. It includes a movie home feed, search, movie detail pages, cast/actor profiles, and trending / upcoming / top-rated sections.

## Project overview

This app is built as a polished movie discovery app with a dark theme and mobile-first layout. The app fetches movie metadata from The Movie Database (TMDB), renders posters and backgrounds, and lets users navigate through a stack of screens.

## Tech stack

- Expo SDK 57
- React Native 0.86.3
- React Navigation (`@react-navigation/native` and `@react-navigation/native-stack`)
- Axios for API requests
- NativeWind / Tailwind-style class names for styling
- Expo Linear Gradient for hero sections
- React Native Reanimated Carousel for the trending banner
- TMDB image CDN for poster and backdrop URLs

## Main project structure

- `App.js` — application entry point, wraps the app in navigation and gesture handling
- `src/navigation/AppNavigator.js` — defines screen routing: Home, Search, Movie, Cast
- `src/screens/` — screen components
  - `HomeScreen.js` — main dashboard with trending, upcoming, and top rated sections
  - `SearchScreen.js` — live search experience for movies
  - `movieScreen.js` — detailed movie view with overview, genres, cast, and similar movies
  - `CastScreen.js` — cast/actor profile viewer with biography and known films
  - `ProfileScreen.js` — placeholder/profile screen stub
- `src/components/` — reusable UI blocks
  - `trendingMovies.js` — carousel for trending movies
  - `movieList.js` — horizontal movie list rows
  - `cast.js` — cast list rows for movie detail screen
  - `Loading.js` — reusable loading indicator
- `src/theme/index.js` — basic shared theme styling
- `api/moviedb.js` — central TMDB client and helper functions
- `.env` — holds the TMDB API key

## Core features

- Trending movie carousel on the home screen
- Upcoming and top-rated movie lists
- Search by movie title with debounce and loading states
- Movie detail page with:
  - backdrop image and title
  - rating and metadata
  - overview and genres
  - cast section
  - similar movies section
- Cast/actor details with biography, stats, and related movies
- Pull-to-refresh and retry flows for network errors
- Dark theme mobile UI with rounded cards and gradients

## API integration

The app connects to TMDB through `api/moviedb.js`.

Key exported functions include:

- `fetchTrendingMovies()`
- `fetchUpcomingMovies()`
- `fetchTopRatedMovies()`
- `searchMovies()`
- `fetchMovieDetails()`
- `fetchMovieCredits()`
- `fetchSimilarMovies()`
- `fetchPersonDetails()`
- `fetchPersonMovies()`

All calls are routed through a shared `apiCall()` helper using the base URL:

- `https://api.themoviedb.org/3`

Poster and backdrop URLs are built with `getImageUrl()` using the TMDB image base.

## Environment configuration

The project currently expects a TMDB API key in the root `.env` file:

```env
VITE_API_KEY='your_tmdb_api_key_here'
```

Important note: this app is an Expo/React Native project, while the current code uses `import.meta.env.VITE_API_KEY`. In Expo, environment variables are usually accessed through `process.env.EXPO_PUBLIC_*` or a custom config setup. If the app is meant to stay Expo-native, the API key access should be updated to an Expo-compatible pattern.

## How to run the project

1. Install dependencies:

```bash
npm install
```

2. Start the Expo app:

```bash
npm start
```

Or directly:

```bash
npx expo start
```

3. Run on a target platform:

```bash
npm run android
npm run ios
npm run web
```

## Recommended local workflow

- Use `npx expo start` for the dev server
- Keep the TMDB key in `.env` or move it to an Expo-safe config strategy
- Test in Android or iOS simulator/emulator for navigation flows
- Verify network and image loading behavior with a valid TMDB key

## Notes and caveats

- `src/screens/ProfileScreen.js` is currently a simple placeholder and not yet a real user profile experience.
- The navigation stack is defined in `AppNavigator.js`, and screens are presented with a dark film-themed styling system.
- The app relies on live TMDB data, so a valid API key and active internet connection are required for successful movie loading.
- Because the project mixes Expo and Vite-style env access (`VITE_API_KEY` + `import.meta.env`), there may be compatibility issues if run without the proper environment configuration.

## Summary

MovieApp is a clean, mobile-first movie browsing app that demonstrates a modern Expo/React Native movie UI with networking, navigation, and media-rich detail pages. It is a good starting point for a media app and can be extended with favorites, watchlists, trailers, and deeper personalization.
