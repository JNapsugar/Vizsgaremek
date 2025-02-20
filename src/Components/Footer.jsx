import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    const permission = sessionStorage.getItem("permission");
    return(
<div>
<footer class="footer">
    <div class="container">
        <div class="row">
            <div class="footer-col">
                <h4>Információk</h4>
                <ul>
                    <li><Link to={"/rolunk"}>Rólunk</Link></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Szolgáltatásaink</h4>
                <ul>
                    <li><Link to={"/regisztracio"} onClick={() => window.scrollTo({ top: 0 })}>Profil készítés</Link></li>  
                    <li><Link to={"/ingatlanok"} onClick={() => window.scrollTo({ top: 0 })}>Ingatlan keresés</Link></li> 
                    {permission == 2? (
                        <li><Link to={"/kiadas"} onClick={() => window.scrollTo({ top: 0 })}>Kiadás</Link></li> ):""}  
                </ul>
            </div>
            <div class="footer-col">
                <h4>Dokumentáció</h4>
                <div class="social-links">
                    <a href="https://github.com/JNapsugar/Vizsgaremek" target='_blank'><img src="/img/icons/github.png" alt="github"/></a>
                    <a href="https://trello.com/w/vizsgaremek22" target='_blank'><img src="/img/icons/trello.png" alt="trello"/></a>
                </div>
            </div>
        </div>
    </div>
</footer>
</div>)
}
