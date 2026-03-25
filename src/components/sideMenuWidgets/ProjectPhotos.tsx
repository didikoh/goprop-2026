
interface ProjectPhotosProp {
    isLandmark: boolean;
    photos: string[];
    photoUIIndex: number;
    setPhotoUIIndex: (photoUIIndex: number) => void;
    onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function ProjectPhotos({ isLandmark, photos, photoUIIndex, setPhotoUIIndex, onError }: ProjectPhotosProp) {
    return (
        <div className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__photos`}>
            {photos.map((photo: any, index: number) => (
                <div
                    className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__photo-container`}
                    key={index}
                    onClick={() => setPhotoUIIndex(index)}
                >
                    <img
                        className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__photo ${
                            (index === photoUIIndex) ? `${(isLandmark) ? 'landmark-info' : 'project-Info'}__photo--active` : ""
                        }`}
                        src={photo}
                        alt={`${(isLandmark) ? 'Landmark' : 'Project'} Photo ${index + 1}`}
                        onError={onError}
                    />
                </div>
            ))}
        </div>
    );
}
