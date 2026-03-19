import { useSearchProjectStore } from "../../stores/projectStore";
import "./styles/SearchBar.css";

const SearchBar = () => {
  const { filterProject, setFilterProject } = useSearchProjectStore();

  return (
    <div className="search-bar">
      <i className="fa-solid fa-search"></i>
      <input
        type="text"
        id="search"
        placeholder="Search Project Name"
        value={filterProject}
        onChange={(e) => setFilterProject(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
