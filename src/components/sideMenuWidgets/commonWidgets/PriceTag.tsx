import type { ProjectModel } from "../../../api/projects/ProjectModel";
import { formatPriceToStr } from "../../../commons/HighEndFunctions";

interface PriceDataProp {
    selectedProject: ProjectModel | null;
}

export function PriceTag({ selectedProject }: PriceDataProp) {
    return (
        <div className="project-Info__specs-wrapper">
            <div className="project-Info__specs-item project-Info__specs-item--price">
                <strong>Price</strong>
                <p style={{ fontFamily: "Bahnschrift, sans-serif", textAlign: "left" }}>
                {((selectedProject?.priceFromMin && selectedProject?.priceFromMax) ? 
                <span>{
                    `${(selectedProject?.rentPriceMin && selectedProject?.rentPriceMax) ? 'Buy: ' : ''}` + 
                    ((selectedProject?.priceFromMin === selectedProject?.priceFromMax) ? `RM${formatPriceToStr(selectedProject?.priceFromMin)}` : `RM${formatPriceToStr(selectedProject?.priceFromMin)} - RM${formatPriceToStr(selectedProject?.priceFromMax)}`)
                }</span> 
                : null)}<br />
                {(selectedProject?.rentPriceMin && selectedProject?.rentPriceMax) ? 
                <span>{
                    `${(selectedProject?.priceFromMin && selectedProject?.priceFromMax) ? 'Rent: ' : ''}` + 
                    ((selectedProject?.rentPriceMin === selectedProject?.rentPriceMax) ? `RM${formatPriceToStr(selectedProject?.rentPriceMin)}` : `RM${formatPriceToStr(selectedProject?.rentPriceMin)} - RM${formatPriceToStr(selectedProject?.rentPriceMax)}`)
                }</span> 
                : null}
                </p>
            </div>
        </div>
    );
}
