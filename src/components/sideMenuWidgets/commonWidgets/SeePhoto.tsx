import { FaRegImages } from "react-icons/fa";

interface SeePhotoProp {
    className01: string;
    className02: string;
    altName: string;
    photos: string[];
    setIsPhotoUI: (isPhotoUI: boolean) => void
    onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function SeePhoto({ className01, className02, altName, photos, setIsPhotoUI, onError }: SeePhotoProp) {
    return (
        <div
            className={className01}
            onClick={() => setIsPhotoUI(true)}
        >
            <div className={className02}>
                <FaRegImages />
                See Photo
            </div>
            <img
                src={photos[0]}
                alt={altName}
                onError={onError}
            />
        </div>
    );
}
