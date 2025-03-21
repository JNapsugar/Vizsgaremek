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
                    <li><Link to={"/rolunk"} onClick={() => window.scrollTo({ top: 0 })}>Rólunk</Link></li>
                    <li><a href="mailto:ingatlanberlesiplatform@gmail.com">ingatlanberlesiplatform@gmail.com</a></li>
                </ul>
            </div>
            <div className="footer-col">
                <h4>Szolgáltatásaink</h4>
                <ul>
                    <li><Link to={"/regisztracio"}>Új profil készítés</Link></li>  
                    <li><Link to={"/ingatlanok"} onClick={() => window.scrollTo({ top: 0 })}>Ingatlan keresés</Link></li> 
                    {permission === "2" || permission === "1"? (
                        <li><Link to={"/kiadas"} onClick={() => window.scrollTo({ top: 0 })}>Kiadás</Link></li> ):""}  
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
