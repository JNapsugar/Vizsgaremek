import React from 'react'
import { Link } from 'react-router-dom'

export default function PropertyListItem({ property, propertyImg }) {
    const services = property.szolgaltatasok ? property.szolgaltatasok.split(', ') : [];
    const displayedServices = services.length > 4 ? services.slice(0, 4) : services;

    return (
        <div className="propertyListItem">
            {propertyImg ? (
                <img src={propertyImg.kepUrl} alt={property.cim} loading="lazy" />
            ) : (
                <img src="img/placeholder.jpg" alt="Placeholder" loading="lazy"/>
            )}
            <div className='Details'>
                <h2>{property.cim}</h2>
                <hr />
                <p>{property.ar} Ft/éjszaka</p>
                <p>{property.meret}m² {property.szoba} szoba</p>
                <div className="listServices">
                    {displayedServices.map((service, index) => {
                        let iconSrc;
                        switch (service) {
                            case "Wi-fi": iconSrc = "/img/icons/wifi.svg"; break;
                            case "kutya hozható": iconSrc = "/img/icons/paw.svg"; break;
                            case "parkolás": iconSrc = "/img/icons/parking.svg"; break;
                            case "medence": iconSrc = "/img/icons/pool.svg"; break;
                            case "kert": iconSrc = "/img/icons/garden.svg"; break;
                            case "légkondícionálás": iconSrc = "/img/icons/airconditioning.svg"; break;
                            case "billiárd": iconSrc = "/img/icons/pooltable.svg"; break;
                            case "ping-pong": iconSrc = "/img/icons/pingpong.svg"; break;
                            case "akadálymentes": iconSrc = "/img/icons/wheelchair.svg"; break;
                            case "baba bútorok": iconSrc = "/img/icons/baby.svg"; break;
                            case "grill": iconSrc = "/img/icons/grill.svg"; break;
                            case "horgásztó": iconSrc = "/img/icons/fishing.svg"; break;
                            case "istálló": iconSrc = "/img/icons/stable.svg"; break;
                            case "erkély/terasz": iconSrc = "/img/icons/balcony.svg"; break;
                            case "házimozi": iconSrc = "/img/icons/cinema.svg"; break;
                            case "mosógép": iconSrc = "/img/icons/washingmachine.svg"; break;
                            case "kávéfőző": iconSrc = "/img/icons/coffeemaker.svg"; break;
                            case "takarítószolgálat": iconSrc = "/img/icons/cleaning.svg"; break;
                            case "biztonsági kamera": iconSrc = "/img/icons/securitycamera.svg"; break;
                            case "golfpálya": iconSrc = "/img/icons/golf.svg"; break;
                            case "spájz": iconSrc = "/img/icons/pantry.png"; break;
                            default: iconSrc = "/img/icons/plus.svg"; break;
                        }
                        return (
                            <div key={index} className="service-item">
                                <img src={iconSrc} alt={service} />
                                {service}
                            </div>
                        );
                    })}
                    {services.length > 4 && (
                        <div className="more-services">
                            <img src="/img/icons/plus.svg" alt="Plus" />
                            Stb...
                        </div>
                    )}
                </div>
            </div>
            <div className='buttonDiv'>
                <div className="link_wrapper">
                    <Link to={`/ingatlanok/${property.ingatlanId}`}>További információk</Link>
                    <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268.832 268.832">
                            <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}
