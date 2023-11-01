/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import styles from './style.module.scss'
// API
import { callAPI } from '../../domain/api'
import { Link } from 'react-router-dom';
import Header from '../Header';

const Main = () => {
  // const [countriesData, setCountriesData] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedRegion, setSelectedRegion] = useState('region')
  const [searchCountries, setSearchCountries] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [favorites, setFavorites] = useState([]);


  const toggleMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  if (isDarkMode) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }

  // All Data Countries
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);

    const fetchData = async () => {
      try {
        let data
        let endpoint = '/all'
        if (selectedRegion !== 'region') {
          endpoint = `/region/${selectedRegion}`
        }

        const results = await callAPI({
          endpoint,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })

        data = results
        setFilteredCountries(data);

      } catch (err) {
        console.log('Data Error', err);
      }
    }

    fetchData()
  }, [selectedRegion])

  const addToFavorites = (country) => {
    const newFavorites = [...favorites, country];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (country) => {
    const newFavorites = favorites.filter((fav) => fav.name.common !== country.name.common);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const cardStyle = {
    backgroundColor: isDarkMode ? 'hsl(209, 23%, 22%)' : 'hsl(0, 0%, 100%)',
  };
  const filterRegionStyle = {
    backgroundColor: isDarkMode ? 'hsl(209, 23%, 22%)' : 'hsl(0, 0%, 100%)',
    color: isDarkMode ? 'hsl(0, 0%, 100%)' : 'hsl(207, 26%, 17%)',
  };
  const searchStyle = {
    backgroundColor: isDarkMode ? 'hsl(209, 23%, 22%)' : 'hsl(0, 0%, 100%)',
    color: isDarkMode ? 'hsl(0, 0%, 100%)' : 'hsl(207, 26%, 17%)',
  }
  const linkStyle = {
    color: isDarkMode ? 'hsl(0, 0%, 100%)' : 'hsl(209, 23%, 22%)',
  };


  return (
    <>
      <Header isDarkMode={isDarkMode} toggleMode={toggleMode} />
      <main>
        <div className={styles.search_filter_container}>
          <div style={searchStyle} className={styles.search_container}>
            <SearchIcon />
            <input style={searchStyle} type="text" placeholder="Search for a country..."
              value={searchCountries} onChange={(e) => setSearchCountries(e.target.value)} />
          </div>
          <select style={filterRegionStyle} className={styles.filter_region} onChange={(e) => setSelectedRegion(e.target.value)}>
            <option hidden> Filter by Region </option>
            <option value='region'> All </option>
            <option value="Africa"> Africa </option>
            <option value="America"> America </option>
            <option value="Asia"> Asia </option>
            <option value="Europe"> Europe </option>
            <option value="Oceania"> Oceania </option>
          </select>
        </div>
        <div className={styles.countries_container}>
          <div className={styles.favorite_countries}>
            {/* Favorite */}
            <div className={styles.title}>
              {favorites.length > 0 && (
                <h2>Your Favorites:</h2>
              )}
            </div>

            <div className={styles.card_countries}>
              {favorites.map((country, index) => (
                <div style={cardStyle} className={styles.countries_card} key={index}>
                  <img src={country.flags.png} alt={`${country.name.common} flag`} />
                  <div style={linkStyle} className={styles.card_text}>
                    <h2 className={styles.card_title}> {country.name.common} </h2>
                    <p> Population: {country.population.toLocaleString()}</p>
                    <p> Region: {country.region}</p>
                    <p> Capital: {country.capital?.[0]}</p>
                    <button className={styles.btn_favorite} onClick={() => removeFromFavorites(country)}>Remove from Favorites</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Countries */}
          <div className={styles.all_countries} >
            <div className={styles.title}>
              <h2>All Countries:</h2>
            </div>
            <div className={styles.card_countries}>
              {filteredCountries
                .filter((country) => country.name.common.toLowerCase().includes(searchCountries.toLowerCase()))
                .map((country, index) => (
                  <Link to={`/detail/${country.name.common}`} key={index}>
                    <div style={cardStyle} className={styles.countries_card}>
                      <img src={country.flags.png} alt={`${country.name.common} flag`} />
                      <div style={linkStyle} className={styles.card_text}>
                        <h2 className={styles.card_title}> {country.name.common} </h2>
                        <p> Population: {country.population.toLocaleString()}</p>
                        <p> Region: {country.region}</p>
                        <p> Capital: {country.capital?.[0]}</p>
                        {favorites.some((fav) => fav.name.common === country.name.common) ? (
                          <button className={styles.btn_favorite} onClick={() => removeFromFavorites(country)}>Remove from Favorites</button>
                        ) : (
                          <button className={styles.btn_favorite} onClick={() => addToFavorites(country)}>Add to Favorites</button>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Main
