
interface ProjectNameProp {
    isLandmark: boolean;
    name: string;
    prevLandmark: () => void;
    nextLandmark: () => void;
}

export function ProjectName({ isLandmark, name, prevLandmark, nextLandmark }: ProjectNameProp) {
    return (
        <div className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__name`}>
            <i className={`fa-solid fa-chevron-left`} onClick={prevLandmark} />
            <h2>{name}</h2>
            <i className={`fa-solid fa-chevron-right`} onClick={nextLandmark} />
        </div>
    );
}
