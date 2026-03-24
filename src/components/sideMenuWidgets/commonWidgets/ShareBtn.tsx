
interface ShareBtnProp { 
    className01: string;
    className02: string;
    clickShare: () => void;
}

export function ShareBtn({ className01, className02, clickShare }: ShareBtnProp) {
    return (
        <div className={className01}>
            <p>Share</p>
            <img
                src="./assets/projectinfo/icons/interact-dot/share.svg"
                alt=""
                className={className02}
                onClick={clickShare}
            />
        </div>
    );
}
