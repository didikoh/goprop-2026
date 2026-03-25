
interface ShareBtnProp { 
    isLandmark: boolean;
    clickShare: () => void;
}

export function ShareBtn({ isLandmark, clickShare }: ShareBtnProp) {
    return (
        <div className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__share`}>
            <p>Share</p>
            <img
                src="./assets/projectinfo/icons/interact-dot/share.svg"
                alt=""
                className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__icon`}
                onClick={clickShare}
            />
        </div>
    );
}
