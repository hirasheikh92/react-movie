interface SearchProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

const Search = ({ searchTerm, setSearchTerm }: SearchProps) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
