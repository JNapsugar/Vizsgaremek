import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    const permission = sessionStorage.getItem("permission");
    return(
<div>
<footer className="footer">
    <div className="container">
        <div className="row">
            <div className="footer-col">
                <h4>Információk</h4>
                <ul>
                    <li><Link to={"/rolunk"}>Rólunk</Link></li>
                    <li><a href="https://mail.google.com/mail/?view=cm&fs=1&to=ingatlanberlesiplatform@gmail.com" target="_blank" rel="noopener noreferrer">ingatlanberlesiplatform@gmail.com</a></li> 
                </ul>
            </div>
            <div className="footer-col">
                <h4>Szolgáltatásaink</h4>
                <ul>
                    <li><Link to={"/regisztracio"}>Új profil készítés</Link></li>  
                    <li><Link to={"/ingatlanok"}>Ingatlan keresés</Link></li> 
                    {permission === "2" || permission === "1"? (
                        <li><Link to={"/kiadas"}>Kiadás</Link></li> ):""}  
                </ul>
            </div>
            <div className="footer-col">
                <h4>Dokumentáció</h4>
                <div className="social-links">
                    <a href="https://github.com/JNapsugar/Vizsgaremek" target='_blank' rel="noreferrer"><img src="/img/icons/github.png" alt="github"/></a>
                    <a href="https://trello.com/w/vizsgaremek22" target='_blank' rel="noreferrer"><img src="/img/icons/trello.png" alt="trello"/></a>
                </div>
            </div>
        </div>
    </div>
</footer>
</div>)
}
