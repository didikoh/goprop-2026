
interface GeoProp {
    isLandmark: boolean;
    location: string;
}

export function GeoLocation({ isLandmark, location }: GeoProp) {
    return (
        <div className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__address`}>
            <img
                src="./assets/projectinfo/icons/interact-dot/location.svg"
                alt=""
                className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__icon`}
            />
            <p>{location}</p>
        </div>
    );
}
