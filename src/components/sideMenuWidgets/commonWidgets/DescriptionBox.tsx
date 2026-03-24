

interface DescriptionProp {
    className01: string;
    className02: string;
    titleLbl?: string;
    data: string;
}

export function DescriptionBox({ className01, className02, titleLbl, data }: DescriptionProp) {
    return (
        <div className={className01}>
            <div className={className02}>
                {(titleLbl) ? <strong>Description</strong> : null}
                <p>{data}</p>
            </div>
        </div>
    );
}
