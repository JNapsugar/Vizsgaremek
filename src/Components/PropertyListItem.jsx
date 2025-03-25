import React from 'react';
import { Link } from 'react-router-dom';

const icons = {
    "Wi-Fi": "/img/icons/wifi.svg",
    "kutya hozható": "/img/icons/paw.svg",
    "parkolás": "/img/icons/parking.svg",
    "medence": "/img/icons/pool.svg",
    "kert": "/img/icons/garden.svg",
    "légkondícionálás": "/img/icons/airconditioning.svg",
    "billiárd": "/img/icons/pooltable.svg",
    "ping-pong": "/img/icons/pingpong.svg",
    "akadálymentes": "/img/icons/wheelchair.svg",
    "baba bútorok": "/img/icons/baby.svg",
    "grill": "/img/icons/grill.svg",
    "horgásztó": "/img/icons/fishing.svg",
    "garázs": "/img/icons/garage.svg",
    "erkély/terasz": "/img/icons/balcony.svg",
    "házi mozi": "/img/icons/cinema.svg",
    "mosógép": "/img/icons/washingmachine.svg",
    "kávéfőző": "/img/icons/coffeemaker.svg",
    "takarító szolgálat": "/img/icons/cleaning.svg",
    "biztonsági kamera": "/img/icons/securitycamera.svg",
    "golfpálya": "/img/icons/golf.svg",
    "spájz": "/img/icons/pantry.png",
};

export default function PropertyListItem({ property, propertyImg }) {
    const services = property.szolgaltatasok ? property.szolgaltatasok.split(', ') : [];
    const displayedServices = services.slice(0, 4);
    const hasMoreServices = services.length > 4;

    const renderServiceIcon = (service) => {
        return icons[service] || "/img/icons/plus.svg";
    };

    return (
        <div className="propertyListItem">
            <img 
                src={propertyImg ? propertyImg.kepUrl : "/img/placeholder.jpg"} 
                alt={property.cim} 
                loading="lazy"
            />
            <div className="Details">
                <h2>{property.cim}</h2>
                <hr />
                <p>{property.ar} Ft/éjszaka</p>
                <p>{property.meret}m² {property.szoba} szoba</p>
                <div className="listServices">
                    {displayedServices.map((service, index) => (
                        <div key={index} className="service-item">
                            <img src={renderServiceIcon(service)} alt={service} />
                            {service}
                        </div>
                    ))}
                    {hasMoreServices && (
                        <div className="more-services">
                            <img src="/img/icons/plus.svg" alt="Plus" />
                            Stb...
                        </div>
                    )}
                </div>
            </div>
            <div className="buttonDiv">
                <div className="link_wrapper">
                    <Link to={`/ingatlanok/${property.ingatlanId}`}>További információk</Link>
                    <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268.832 268.832">
                            <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
