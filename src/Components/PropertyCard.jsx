import React from 'react'
import { Link } from 'react-router-dom'

export default function PropertyCard({key, property}) {
    return (
        <div key={key} className="card">
            {/* property.ingatlankepeks && property.ingatlankepeks.length > 0 */}
            {property.kep ? (
                <img src={property.kep} alt={property.cim} loading="lazy" />
            ) : (
                <img src="img/placeholder.jpg" alt="Placeholder" loading="lazy"/>
            )}
            <div className="card-content">
                <h2>{property.helyszin} <span className="price">{property.ar} Ft/éjszaka</span></h2>
                <div className="TovabbiInformaciok">
                    <p>
                        {property.meret}m², {property.szobak} szoba<br />
                        {property.szolgaltatasok}<br />
                        
                    </p>
                </div>
                <Link to={"/ingatlanok/" + property.ingatlanId}>
                    <button>
                        További információk
                    </button>
                </Link>
            </div>
        </div>
    )
}
