import { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "./Search";
import { useDebounce } from "react-use";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import { API_BASE_URL, API_OPTIONS } from "../services/api";
import { getTrendingMovies, updateSearchCount } from "../appwrite";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  interface TrendingMovie {
    $id: string;
    poster_url: string;
    title: string;
  }

  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      if (data.Response === "False") {
        setError(data.Error || "Failed to fetch movies");
        setMovies([]);
        return;
      }

      setMovies(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setError("Error fetching movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      const trending: TrendingMovie[] = (movies || []).map((movie: any) => ({
        $id: movie.$id,
        poster_url: movie.poster_url,
        title: movie.title,
      }));

      setTrendingMovies(trending);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <Header />
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      {trendingMovies.length > 0 && (
        <section className="trending px-20">
          <h2>Trending Movies</h2>

          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.title} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="all-movies px-20">
        <h2>All Movies</h2>
        {loading ? (
          <Spinner />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul>
            {movies.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Home;
