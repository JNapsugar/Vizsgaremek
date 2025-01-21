import React from 'react'
import { Link } from 'react-router-dom'

export default function PropertyCard({property}) {
    return (
        <div key={property.ingatlanId} className="card">
            {property.ingatlankepeks && property.ingatlankepeks.length > 0 ? (
                <img src={property.ingatlankepeks[0]} alt={property.cim} loading="lazy"/>
            ) : (
                <img src="img/placeholder.jpg" alt="Placeholder" loading="lazy"/>
            )}
            <div className="card-content">
                <h2>{property.helyszin} <span className="price">{property.ar} Ft/éjszaka</span></h2>
                <div className="TovabbiInformaciok">
                    <p>{property.meret}m²<br />{property.szolgaltatasok}</p>
                </div>
                <Link to={"/ingatlanok/" + property.ingatlanId}><button>További információk</button></Link>
            </div>
        </div>
    )
}
