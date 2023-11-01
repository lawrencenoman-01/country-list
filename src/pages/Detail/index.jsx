/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import { Link, useParams } from "react-router-dom";
import Header from "../Header"
import styles from './style.module.scss'
// import Flag from '../../assets/images/flag.png'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import { callAPI } from '../../domain/api';

const Detail = () => {
    const { countryName, borders } = useParams();
    const [countryData, setCountryData] = useState(null);
    const [borderCountriesData, setBorderCountriesData] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false)

    const toggleMode = () => {
        setIsDarkMode(!isDarkMode)
    }

    if (isDarkMode) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const endpoint = `/name/${countryName}?fullText=true`;
                const method = 'GET';
                const headers = {
                    'Content-Type': 'application/json'
                };

                const country = await callAPI({ endpoint, method, headers });
                setCountryData(country[0]);

                const dataBorder = country[0].borders

                if (dataBorder && dataBorder.length > 0) {
                    const borderData = await Promise.all(
                        dataBorder.map(async (border) => {
                            const response = await callAPI({
                                endpoint: `/alpha/${border}`,
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                            return response[0]
                        })
                    );

                    setBorderCountriesData(borderData);
                }
            } catch (err) {
                console.log('Data Error', err);
            }
        };

        fetchData();
    }, [countryName]);

    const linkStyle = {
        color: isDarkMode ? 'hsl(0, 0%, 100%)' : 'hsl(209, 23%, 22%)',
    };
    const buttonStyle = {
        backgroundColor: isDarkMode ? 'hsl(209, 23%, 22%)' : 'hsl(0, 0%, 100%)',
        color: isDarkMode ? 'hsl(0, 0%, 100%)' : 'hsl(207, 26%, 17%)',
    };

    return (
        <>
            <Header isDarkMode={isDarkMode} toggleMode={toggleMode} />
            <main>
                <div className={styles.country_details_container}>
                    <div className={styles.btn}>
                        <Link to='/'>
                            <button style={buttonStyle} className={styles.btn_back}><ArrowBackIcon /> Back </button>
                        </Link>
                    </div>
                    {countryData && (
                        <div style={linkStyle} className={styles.country_details}>
                            <img src={countryData.flags?.png} alt={`${countryData.name?.common} flag`} />
                            <div>
                                <h1> {countryData.name?.common} </h1>
                                <div className={styles.text_details}>
                                    <p><b>Native Name: </b>{countryData.translations?.ces?.common}</p>
                                    <p><b>Population: </b>{countryData.population?.toLocaleString()}</p>
                                    <p><b>Region: </b>{countryData.region}</p>
                                    <p><b>Sub Region: </b>{countryData.subregion}</p>
                                    <p><b>Capital: </b>{countryData.capital?.[0]}</p>
                                    <p><b>Top Level Domain: </b>{countryData.tld && Object.values(countryData.tld).join(', ')}</p>
                                    <p><b>Currencies: </b>{countryData.currencies && Object.values(countryData.currencies).map((currency) => currency.name).join(', ')}</p>
                                    <p><b>Languages: </b>{countryData.languages && Object.values(countryData.languages).join(', ')}</p>
                                </div>
                                <div className={styles.country_borders}>
                                    <b> Border Countries: </b>
                                    {borderCountriesData.length > 0 ? (
                                        borderCountriesData.map((border, index) => (
                                            <Link to={`/alpha/${border}`} key={index} className={styles.btn_border}>
                                                {border.name && border.name.common}
                                            </Link>
                                        ))
                                    ) : (
                                        <p>No border countries available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}

export default Detail;

