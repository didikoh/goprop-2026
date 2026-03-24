
interface KeyValueProp {
    className01?: string;
    className02: string;
    label: string;
    data: string;
    imgClass?: string;
    imgSrc?: string;
    imgAlt?: string;
}

export function KeyValueSpec({ className02, label, data, imgClass, imgSrc, imgAlt }: KeyValueProp) {
    return (
        <div className={className02}>
            {(imgSrc) ? 
            <img
                className={imgClass}
                src={imgSrc}
                alt={imgAlt}
            /> :
            <strong>{label}</strong>}
            <p>{data}</p>
        </div>
    );
}

export function KeyValueSpecWrap({ className01, className02, label, data, imgClass, imgSrc, imgAlt }: KeyValueProp) {
    return (
        <div className={className01}>
            <KeyValueSpec className02={className02} label={label} data={data} imgClass={imgClass} imgSrc={imgSrc} imgAlt={imgAlt} />
        </div>
    );
}
