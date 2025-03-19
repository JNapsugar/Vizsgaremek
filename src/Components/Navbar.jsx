import React from 'react'
import { Link } from 'react-router-dom'


export default function Navbar() {
    const permission = sessionStorage.getItem("permission");
return (
    <nav className="navbar">
        <Link to={"/"} className="navItem">Főoldal</Link>
        <Link to={"/ingatlanok"} className="navItem">Ingatlanok</Link>
        {permission === "2"? (
        <Link to={"/kiadas"} className="navItem">Kiadás</Link>):""}
        <Link to={"/rolunk"} className="navItem">Rólunk</Link>
        <button className="belepesBtn">
        {permission?
        <Link to={"/profil"} className="belepesBtn">Profilom</Link> :
        <Link to={"/belepes"} className="belepesBtn">Belépés</Link>
        }
            
        </button>
    </nav>
)
}
