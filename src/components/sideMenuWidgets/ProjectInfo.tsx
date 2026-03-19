
import "./styles/ProjectInfo.css";
import { FaRegImages } from "react-icons/fa";
import { useEffect, useState } from "react";
import { usePhotosStore, usePhotoUIIndStore, useUIPhotoStore } from "../../stores/uiPhotoStore";
import { useProjectDataStore, useProjectsArrStore, useProjectStore, ProjectDataInt } from "../../stores/projectStore";
import { useSideMenuMinimizeStore } from "../../stores/sideMenuStore";
import { formatPriceToStr, getPhotos } from "../../commons/HighEndFunctions";
import { keyplanUrl, photosUrl } from "../../commons/Constants";
import { useLocationStore } from "../../stores/locationStore";
import { useExtOverlayStore } from "../../stores/externalOverlayStore";
import { useExtIframeStore } from "../../stores/externalIframeStore";
import Button from "./Button";
import "./styles/Button.css";

interface PurchaseModeProp {
  purchaseMode: number;
}

const ProjectInfo = ({ purchaseMode }: PurchaseModeProp) => {
  const { setIsExternalOverlay } = useExtOverlayStore();
  const { setExternalIframeUrl } = useExtIframeStore();
  const { projects } = useProjectsArrStore();
  const { setProjectData } = useProjectDataStore();
  const { isPhotoUI, setIsPhotoUI } = useUIPhotoStore();
  const { photoUIIndex, setPhotoUIIndex } = usePhotoUIIndStore();
  const { photos, setPhotos } = usePhotosStore();
  const { location } = useLocationStore();
  const { project: selectedProject, setProject: setSelectedProject } = useProjectStore();
  const { isSideMenuMinimized, setIsSideMenuMinimized } = useSideMenuMinimizeStore();

  const [highlights, setHighlights] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);

  const [nextProjectTimeout, setNextProjectTimeout] = useState<number | null>(
    null
  );

  const nextProject = () => {
    if (nextProjectTimeout) return;
    const projectIndex = projects.findIndex(
      (project: any) => project.name === selectedProject?.name
    );
    const nextIndex = (projectIndex + 1) % projects.length;
    setSelectedProject(projects[nextIndex]);
    // if (focusTargetRef.current) {
    //   focusTargetRef.current(projects[nextIndex].name);
    // }
    setNextProjectTimeout(
      window.setTimeout(() => setNextProjectTimeout(null), 1200)
    );
  };

  const prevProject = () => {
    if (nextProjectTimeout) return;
    const projectIndex = projects.findIndex(
      (project: any) => project.name === selectedProject?.name
    );
    const prevIndex = (projectIndex - 1 + projects.length) % projects.length;
    setSelectedProject(projects[prevIndex]);
    // if (focusTargetRef.current) {
    //   focusTargetRef.current(projects[prevIndex].name);
    //   console.log("Focusing on project:", projects[prevIndex].name);
    // }
    setNextProjectTimeout(
      window.setTimeout(() => setNextProjectTimeout(null), 1200)
    );
  };

  const handleLocationClick = () => {
    setProjectData((prevData: any) => ({
      ...prevData,
      p_location: prevData.p_location + 1,
    }));
    setExternalIframeUrl(
      selectedProject?.panoramas || "./construction/index.html"
    );
  };

  const handleVirtualTourClick = () => {
    setProjectData((prevData: any) => ({
      ...prevData,
      p_virtual_tour: prevData.p_virtual_tour + 1,
    }));
    setExternalIframeUrl(
      selectedProject?.interior || "./construction/index.html"
    );
  };

  const handleFloorPlanClick = () => {
    setProjectData((prevData: any) => ({
      ...prevData,
      p_floor_plan: prevData.p_floor_plan + 1,
    }));
    setExternalIframeUrl(
      keyplanUrl + selectedProject?.name || "./construction/index.html"
    );
  };

  const handleVideoClick = () => {
    setProjectData((prevData: any) => ({
      ...prevData,
      p_video: prevData.p_video + 1,
    }));
    setExternalIframeUrl(
      selectedProject?.videos || "./construction/index.html"
    );
  };

  const handleSocialMediaClick = () => {
    setProjectData((prevData: any) => ({
      ...prevData,
      p_external: prevData.p_external + 1,
    }));
    setIsExternalOverlay(true);
  };

  const actionItems = {
    location: {
      icon: "./assets/projectinfo/icons/interact-dot/location.svg",
      label: "Location",
      onClick: handleLocationClick,
      disabled: !selectedProject?.panoramas,
    },
    virtualTour: {
      icon: "./assets/projectinfo/icons/interact-dot/360.svg",
      label: "Virtual Tour",
      onClick: handleVirtualTourClick,
      disabled: !selectedProject?.interior,
    },
    floorPlan: {
      icon: "./assets/projectinfo/icons/interact-dot/floor-plan.svg",
      label: "Floor Plan",
      onClick: handleFloorPlanClick,
      disabled: !selectedProject?.name,
    },
    video: {
      icon: "./assets/projectinfo/icons/interact-dot/video.svg",
      label: "Video",
      onClick: handleVideoClick,
      disabled: !selectedProject?.videos,
    },
    socialMedia: {
      icon: "./assets/projectinfo/icons/interact-dot/sm.png",
      label: "Social Media",
      onClick: handleSocialMediaClick,
      disabled: false,
    },
  };

  useEffect(() => {
    if (selectedProject) {
      setHighlights(JSON.parse(selectedProject.highlights ?? ''));
      setFacilities(JSON.parse(selectedProject.facilities ?? ''));
      setPhotos(getPhotos(selectedProject, photosUrl, location));
    }
  }, [selectedProject]);

  return (
    <div className="project-Info">
      {isPhotoUI ? (
        <div className="project-Info__photos">
          {photos.map((photo: any, index: number) => (
            <div
              className="project-Info__photo-container"
              key={index}
              onClick={() => setPhotoUIIndex(index)}
            >
              <img
                className={`project-Info__photo ${
                  index === photoUIIndex ? "project-Info__photo--active" : ""
                }`}
                src={photo}
                alt={`Project Photo ${index + 1}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="project-Info__details">
          <div className="project-Info__minimize-toggle">
            <button
              onClick={() => setIsSideMenuMinimized(!isSideMenuMinimized)}
            >
              <i
                className={`fa-solid fa-chevron-left ${
                  isSideMenuMinimized
                    ? "project-Info__minimize-button--minimized"
                    : "project-Info__minimize-button"
                }`}
              ></i>
            </button>
          </div>
          <div
            className="project-Info__image"
            onClick={() => setIsPhotoUI(true)}
          >
            <div className="project-Info__image-label">
              <FaRegImages />
              See Photo
            </div>
            <img src={photos[0]} alt="Project Image" />
          </div>

          <div className="project-Info__info1">
            <div className="project-Info__name">
              <i className="fa-solid fa-chevron-left" onClick={() => {}} />
              <h2>{selectedProject?.name}</h2>
              <i className="fa-solid fa-chevron-right" onClick={() => {}} />
            </div>
            <div className="project-Info__address">
              <img
                src="./assets/projectinfo/icons/interact-dot/location.svg"
                alt=""
                className="project-Info__icon"
              />
              <p>{selectedProject?.address}</p>
            </div>
            <div className="project-Info__wrapper">
              <div className="project-Info__views">
                <p>{selectedProject?.views} views</p>
              </div>
              <div className="project-Info__likes">
                <img
                  src="./assets/projectinfo/icons/love-gray.svg"
                  className="project-Info__icon"
                  alt="likes Icon"
                />
                <p>{selectedProject?.likes} likes</p>
              </div>
              <div className="project-Info__share">
                <p>Share</p>
                <img
                  src="./assets/projectinfo/icons/interact-dot/share.svg"
                  alt=""
                  className="project-Info__icon"
                />
              </div>
            </div>
          </div>

          <div className="project-Info__info2">
            <div className="project-Info__actions">
              {Object.entries(actionItems).map(([key, item]) => (
                <div className="project-Info__action-item" key={key}>
                  <button
                    className="project-Info__icon-container"
                    onClick={item.onClick}
                    disabled={item.disabled || false}
                  >
                    <img
                      className="project-Info__icon"
                      src={item.icon}
                      alt={`${item.label} Icon`}
                    />
                  </button>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="project-Info__info3">
            <div className="project-Info__specs">
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
              <div className="project-Info__specs-wrapper">
                <div className="project-Info__specs-item">
                  <img
                    className="project-Info__icon"
                    src="./assets/projectinfo/icons/bed.svg"
                    alt="Bedroom Icon"
                  />
                  <p>{(selectedProject?.bedroomMin === selectedProject?.bedroomMax) ? selectedProject?.bedroomMax : `${selectedProject?.bedroomMin} - ${selectedProject?.bedroomMax}`}</p>
                </div>
                <div className="project-Info__specs-item">
                  <img
                    className="project-Info__icon"
                    src="./assets/projectinfo/icons/bath.svg"
                    alt="Bathroom Icon"
                  />
                  <p>{(selectedProject?.bathroomMin === selectedProject?.bathroomMax) ? selectedProject?.bathroomMax : `${selectedProject?.bathroomMin} - ${selectedProject?.bathroomMax}`}</p>
                </div>
                <div className="project-Info__specs-item">
                  <img
                    className="project-Info__icon"
                    src="./assets/projectinfo/icons/parking.svg"
                    alt="Carpark Icon"
                  />
                  <p>{((selectedProject?.carparkMin === null) && (selectedProject.carparkMax === null)) ? `-` : ((selectedProject?.carparkMin === selectedProject?.carparkMax) ? selectedProject?.carparkMax : `${selectedProject?.carparkMin} - ${selectedProject?.carparkMax}`)}</p>
                </div>
              </div>
              <div className="project-Info__specs-wrapper">
                <div className="project-Info__specs-item">
                  <img
                    className="project-Info__icon"
                    src="./assets/projectinfo/icons/size.svg"
                    alt="Size Icon"
                  />
                  <p>{(selectedProject?.sizeMin === selectedProject?.sizeMax) ? selectedProject?.sizeMax : `${selectedProject?.sizeMin} sqft - ${selectedProject?.sizeMax} sqft`}</p>
                </div>
              </div>
              <div className="project-Info__specs-wrapper">
                <div className="project-Info__specs-item">
                  <strong>Tenure</strong>
                  {selectedProject?.tenure}
                </div>
              </div>
              <div className="project-Info__specs-wrapper">
                <div className="project-Info__specs-item">
                  <strong>Completion Year</strong>
                  {selectedProject?.year}
                </div>
              </div>
            </div>
          </div>

          <div className="project-Info__info4">
            <div className="project-Info__description">
              <strong>Description</strong>
              <p>{selectedProject?.description}</p>
            </div>
          </div>

          <div className="project-Info__info5">
            <div className="project-Info__highlights">
              <div className="project-Info__highlights-title">
                <strong>Highlights</strong>
              </div>
              {highlights.map((highlight: any, index: number) => (
                <div className="project-Info__highlights-list" key={index}>
                  <div className="project-Info__highlights-item">
                    <img
                      className="project-Info__icon"
                      src={`./assets/individualmenu/hightlights/${highlight.icon}.svg`}
                      alt={highlight.icon}
                    ></img>
                    <p>{highlight.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="project-Info__info6">
            <div className="project-Info__facilities">
              <div className="project-Info__facilities-title">
                <strong>Facilities</strong>
              </div>
              {facilities.map((facility: any, index: number) => (
                <div className="project-Info__facilities-list" key={index}>
                  <div className="project-Info__facilities-item">
                    <img
                      className="project-Info__icon"
                      src={`./assets/individualmenu/facilities/${facility.icon}.svg`}
                      alt={facility.icon}
                    ></img>
                    <p>{facility.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="project-Info__info7">
            <div className="project-Info__developer">
              <div className="project-Info__developer-title">
                <strong>Developer</strong>
              </div>
              <div className="project-Info__developer-list">
                <strong>{selectedProject?.developer}</strong>
                <p>{selectedProject?.developerDesc}</p>
              </div>
            </div>
          </div>
        
        </div>
      )}
      <div className="project-Info__footer">
            <div className="project-Info__text">
              <strong>{(purchaseMode === 0) ? `Price From` : ((purchaseMode === 1) ? `Rent From` : '')}</strong>
              <p style={{ fontFamily: "Bahnschrift, sans-serif", textAlign: "left" }}>
                <span>{(purchaseMode === 0) ? `RM${formatPriceToStr(selectedProject?.priceFromMin ?? 0)}` : ((purchaseMode === 1) ? `RM${formatPriceToStr(selectedProject?.rentPriceMin ?? 0)}` : '')}</span>
              </p>
            </div>
            <div className="project-Info__button">
              <Button variant="secondary">Explore More</Button>
            </div>
        </div>
    </div>
  );
};

export default ProjectInfo;
