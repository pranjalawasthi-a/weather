import { useEffect, useState } from "react";
import { fetchCountries } from "../../utils/basicUtils";
import styles from "./style.module.css";
import { useRouter } from "next/router";

const CountriesPage = () => {
    const [countryList, setCountryList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [displayMode, setDisplayMode] = useState("table");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25); // Default limit
    const router = useRouter();

    useEffect(() => {
        fetchCountries().then(setCountryList);
    }, []);

    // Filter countries based on search query
    const filteredCountries = countryList.filter((country) =>
        country.name?.common?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total pages
    const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

    // Slice the list based on current page and items per page
    const paginatedCountries = filteredCountries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCountryClick = (country) => {
        router.push(`/weather/${encodeURIComponent(country.name.common)}`);
    };

    // Handle next and previous buttons
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing limit
    };

    return (
        <div>
            <h1>Country List</h1>

            <div className={`${styles.flex} ${styles.mt20}`}>
                <div className={styles.functionalityContainer}>
                    <input
                        type="text"
                        placeholder="Search country..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className={styles.buttonContainer}>
                    <button
                        className={`${styles.button} ${displayMode === "table" ? styles.blackButton : styles.whiteButton}`}
                        onClick={() => setDisplayMode("table")}
                    >
                        Table View
                    </button>
                    <button
                        className={`${styles.button} ${displayMode === "grid" ? styles.blackButton : styles.whiteButton}`}
                        onClick={() => setDisplayMode("grid")}
                    >
                        Grid View
                    </button>
                </div>

                {/* Items per page dropdown */}
                <div className={styles.paginationControls}>
                    <label htmlFor="itemsPerPage">Show: </label>
                    <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>

            {displayMode === "table" ? (
                <table border="1" className={styles.table}>
                    <thead>
                        <tr>
                            <th>Flag</th>
                            <th>Name</th>
                            <th>Capital</th>
                            <th>Region</th>
                            <th>Population</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCountries.map((country) => (
                            <tr key={country.cca3} onClick={() => handleCountryClick(country)}>
                                <td>
                                    <img src={country.flags?.png} alt={country.name.common} width="30" />
                                </td>
                                <td>{country.name.common}</td>
                                <td>{country.capital?.[0] || "N/A"}</td>
                                <td>{country.region}</td>
                                <td>{country.population.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "10px",
                    }}
                >
                    {paginatedCountries.map((country) => (
                        <div
                            key={country.cca3}
                            onClick={() => handleCountryClick(country)}
                            style={{
                                border: "1px solid #ddd",
                                padding: "10px",
                                cursor: "pointer",
                            }}
                        >
                            <img src={country.flags?.png} alt={country.name.common} width="100%" />
                            <h3>{country.name.common}</h3>
                            <p>Capital: {country.capital?.[0] || "N/A"}</p>
                            <p>Region: {country.region}</p>
                            <p>Population: {country.population.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className={styles.paginationContainer}>
                <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default CountriesPage;
