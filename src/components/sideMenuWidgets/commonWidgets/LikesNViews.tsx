
interface NumberProp {
    no: number;
}

export function LikesNo({ no }: NumberProp) {
    return (
        <div className="project-Info__likes">
            <img
                src="./assets/projectinfo/icons/love-gray.svg"
                className="project-Info__icon"
                alt="likes Icon"
            />
            <p>{no} likes</p>
        </div>
    );
}

export function ViewsNo({ no }: NumberProp) {
    return (
        <div className="project-Info__views">
            <p>{no} views</p>
        </div>
    );
}

export function HighlightsBox({ highLight }: any) {
    return (
        <div className="landmark-info__highlight">
            <p>{highLight}</p>
        </div>
    );
}

