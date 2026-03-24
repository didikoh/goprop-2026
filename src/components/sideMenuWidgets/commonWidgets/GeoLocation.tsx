
interface GeoProp {
    className01: string;
    className02: string;
    location: string;
}

export function GeoLocation({ className01, className02, location }: GeoProp) {
    return (
        <div className={className01}>
            <img
                src="./assets/projectinfo/icons/interact-dot/location.svg"
                alt=""
                className={className02}
            />
            <p>{location}</p>
        </div>
    );
}
