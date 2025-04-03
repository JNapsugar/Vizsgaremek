import React from 'react';
import { Link } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';

export default function PropertyCard({ index, property, propertyImg }) {
    //Szolgáltatások megjelenítése
    const services = property.szolgaltatasok ? property.szolgaltatasok.split(', ') : [];
    const displayedServices = services.slice(0, 5);
    
    return (
        <div key={index} className="card">
            <img src={propertyImg?.kepUrl || "/img/placeholder.jpg"} alt={property.cim || "Placeholder"} loading="lazy" />
            <div className="card-content">
                <h2>
                    {property.helyszin} 
                    <span className="price">{property.ar} Ft/éjszaka</span>
                </h2>
                <div className="TovabbiInformaciok">
                    <p>
                        {property.meret} m², {property.szoba} szoba<br />
                        {displayedServices.join(', ')}{services.length > 5 && '...'}
                    </p>
                </div>
                <Link to={`/ingatlanok/${property.ingatlanId}`}>
                    <button>További információk</button>
                </Link>
            </div>
        </div>
    );
}
