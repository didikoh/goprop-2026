
class ImgObjProp {
    imgClass?: string;
    imgSrc?: string;
    imgAlt?: string;
}

interface KeyValueProp {
    isLandmark: boolean;
    className01?: string;
    className02?: string;
    label: string;
    data: string;
    img?: ImgObjProp;
}

export function KeyValueSpec({ isLandmark, label, data, img }: KeyValueProp) {
    return (
        <div className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__specs-item`}>
            {(img?.imgSrc) ? 
            <img
                className={img?.imgClass}
                src={img?.imgSrc}
                alt={img?.imgAlt}
            /> :
            <strong>{label}</strong>}
            <p>{data}</p>
        </div>
    );
}

export function KeyValueSpecWrap({ isLandmark, label, data, img }: KeyValueProp) {
    return (
        <div className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__specs-wrapper`}>
            <KeyValueSpec isLandmark={isLandmark} label={label} data={data} img={img} />
        </div>
    );
}
