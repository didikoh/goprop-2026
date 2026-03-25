import type { LandmarkModel } from "../../../api/landmarks/LandmarkModel";
import type { ProjectModel } from "../../../api/projects/ProjectModel";
import { formatPriceToStr } from "../../../commons/HighEndFunctions";
import Button from "./Button";

interface InfoFooterProp {
    isLandmark: boolean;
    selectedLandmark?: LandmarkModel | null;
    purchaseMode?: number;
    selectedProject?: ProjectModel | null;
    handleOnClick?: () => void;
}

export function InfoFooter({ isLandmark, selectedLandmark, purchaseMode, selectedProject, handleOnClick }: InfoFooterProp) {
    return (
        <div className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__footer`}>
            <div className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__text`}>
                <strong>{(isLandmark) ? `Landmark` : ((purchaseMode === 0) ? `Price From` : ((purchaseMode === 1) ? `Rent From` : ''))}</strong>
                {(isLandmark) ? `${selectedLandmark?.highLight}` : <p style={{ fontFamily: "Bahnschrift, sans-serif", textAlign: "left" }}>
                    <span>{(purchaseMode === 0) ? `RM${formatPriceToStr(selectedProject?.priceFromMin ?? 0)}` : ((purchaseMode === 1) ? `RM${formatPriceToStr(selectedProject?.rentPriceMin ?? 0)}` : '')}</span>
                </p>}
            </div>
            <div className={`${(isLandmark) ? 'landmark-info' : 'project-Info'}__button`}>
                <Button variant="secondary" onClick={handleOnClick}>{(isLandmark) ? 'Visit Official Site' : 'Explore More'}</Button>
            </div>
        </div>
    );
}
