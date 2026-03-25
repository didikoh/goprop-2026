

interface DescriptionProp {
    isLandmark?: boolean;
    className02?: string;
    titleLbl00?: string;
    titleLbl?: string;
    data: string;
}

export function SubDescriptionBox({ className02, titleLbl, data }: DescriptionProp) {
    return (
        <div className={className02}>
            {(titleLbl) ? <strong>{titleLbl}</strong> : null}
            <p>{data}</p>
        </div>
    );
}

export function DescriptionBox({ isLandmark, titleLbl, data }: DescriptionProp) {
    return (
        <div className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__info${(isLandmark) ? '3' : '4'}`}>
            <SubDescriptionBox className02={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__description`} titleLbl={titleLbl} data={data} />
        </div>
    );
}

export function DeveloperBox({ className02, titleLbl, data }: DescriptionProp) {
    return (
        <div className="project-Info__info7">
            <div className="project-Info__developer">
              <div className="project-Info__developer-title">
                <strong>Developer</strong>
              </div>
              <SubDescriptionBox className02={className02} titleLbl={titleLbl} data={data} />
            </div>
        </div>
    );
}
