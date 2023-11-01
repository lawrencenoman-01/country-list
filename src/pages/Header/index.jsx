/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import styles from './style.module.scss'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

const Header = ({isDarkMode, toggleMode}) => {

  // Style Color
  const linkStyle = {
    color: isDarkMode ? 'hsl(0, 0%, 100%)' : 'hsl(209, 23%, 22%)',
  };
  const buttonStyle = {
    backgroundColor: isDarkMode ? 'hsl(207, 26%, 17%)' : 'hsl(0, 0%, 100%)',
    color: isDarkMode ? 'hsl(0, 0%, 100%)' : 'hsl(207, 26%, 17%)',
  }


  return (
    <header className={styles.header_container}>
      <div className={styles.header_content}>
        <h1><a href='/' style={linkStyle}> Where in the world? </a></h1>
        <button style={buttonStyle} className={styles.button_changer} onClick={toggleMode}>
          <DarkModeOutlinedIcon /> {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </header>
  )
}

export default Header
