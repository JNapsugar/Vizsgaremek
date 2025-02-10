import { render } from '@testing-library/react';
import React from 'react'
import { Link } from 'react-router-dom'

export default function PropertyCard({index, property, propertyImg}) {
    const services = property.szolgaltatasok ? property.szolgaltatasok.split(', ') : [];
    const displayedServices = services.length > 5 ? services.slice(0, 5) : services;
    return (
        <div key={index} className="card">
            {propertyImg ? (
                <img src={propertyImg.kepUrl} alt={property.cim} loading="lazy" />
            ) : (
                <img src="img/placeholder.jpg" alt="Placeholder" loading="lazy"/>
            )}
            <div className="card-content">
                <h2>{property.helyszin} <span className="price">{property.ar} Ft/hónap</span></h2>
                <div className="TovabbiInformaciok">
                    <p>
                        {property.meret} m², {property.szoba} szoba<br />
                        {displayedServices.join(', ')}{services.length > 3 && '...'}
                    </p>
                </div>
                <Link to={"/ingatlanok/" + property.ingatlanId} onClick={() => window.scrollTo({ top: 0 })}>
                    <button>
                        További információk
                    </button>
                </Link>
            </div>
        </div>
    )
}
