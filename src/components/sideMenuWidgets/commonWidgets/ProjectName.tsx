

interface ProjectNameProp {
    name: string;
    className: string;
    prevLandmark: () => void;
    nextLandmark: () => void;
}

export function ProjectName({ name, className, prevLandmark, nextLandmark }: ProjectNameProp) {
    return (
        <div className={className}>
            <i className="fa-solid fa-chevron-left" onClick={prevLandmark} />
            <h2>{name}</h2>
            <i className="fa-solid fa-chevron-right" onClick={nextLandmark} />
        </div>
    );
}
