import React from 'react'
import { Link } from 'react-router-dom'

export default function PropertyCard({key, property}) {
    const services = property.szolgaltatasok ? property.szolgaltatasok.split(', ') : [];
    const displayedServices = services.length > 5 ? services.slice(0, 5) : services;
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
                        {property.meret}m², {property.szoba} szoba<br />
                        {displayedServices.join(', ')}{services.length > 3 && '...'}
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
