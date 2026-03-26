import "./styles/ProjectInfo.css";
import { useEffect, useState } from "react";
import { usePhotosStore, usePhotoUIIndStore, useUIPhotoStore } from "../../stores/uiPhotoStore";
import { useProjectDataStore, useProjectsArrStore, useProjectStore } from "../../stores/projectStore";
import { useSideMenuMinimizeStore } from "../../stores/sideMenuStore";
import { getPhotos } from "../../commons/HighEndFunctions";
import { keyplanUrl, photosUrl } from "../../commons/Constants";
import { useLocationStore } from "../../stores/locationStore";
import { useExtOverlayStore } from "../../stores/externalOverlayStore";
import { useExtIframeStore } from "../../stores/externalIframeStore";
import "./styles/Button.css";
import { SeePhoto } from "./commonWidgets/SeePhoto";
import { GeoLocation } from "./commonWidgets/GeoLocation";
import { ShareBtn } from "./commonWidgets/ShareBtn";
import { KeyValueSpec, KeyValueSpecWrap } from "./commonWidgets/KeyValueSpec";
import { DescriptionBox, DeveloperBox } from "./commonWidgets/DescriptionBox";
import { ProjectName } from "./commonWidgets/ProjectName";
import { PerksListing } from "./commonWidgets/PerksListing";
import { PriceTag } from "./commonWidgets/PriceTag";
import { ActionButtonsContainer } from "./commonWidgets/ActionButton";
import { LikesNo, ViewsNo } from "./commonWidgets/LikesNViews";
import { ProjectPhotos } from "./ProjectPhotos";
import { InfoFooter } from "./commonWidgets/InfoFooter";
import { useRegionMenuStore } from "../../stores/regionMenuStore";
import type { ProjectModel } from "../../api/projects/ProjectModel";

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
  const { selectedMenu: regionMenu } = useRegionMenuStore();

  const [highlights, setHighlights] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);

  const [nextProjectTimeout, setNextProjectTimeout] = useState<number | null>(
    null
  );

  // console.log(`Projects = ${JSON.stringify(projects)}`);
  // console.log(`Projects (in current location) = ${JSON.stringify(projects.filter((project) => (project.region === regionMenu)))}, length = ${projects.filter((project) => (project.region === regionMenu)).length}`);
  let regionProjects: ProjectModel[] = [];
  setTimeout(() => {
    regionProjects = projects.filter((project) => (project.region === regionMenu));
  }, 0);

  const nextProject = () => {
    if (nextProjectTimeout) return;
    const projectIndex = regionProjects.findIndex(
      (project: any) => (project.name === selectedProject?.name)
    );
    const nextIndex = (projectIndex + 1) % regionProjects.length;
    setSelectedProject(regionProjects[nextIndex]);
    // if (focusTargetRef.current) {
    //   focusTargetRef.current(projects[nextIndex].name);
    // }
    setNextProjectTimeout(
      window.setTimeout(() => setNextProjectTimeout(null), 1200)
    );
  };

  const prevProject = () => {
    if (nextProjectTimeout) return;
    const projectIndex = regionProjects.findIndex(
      (project: any) => (project.name === selectedProject?.name)
    );
    const prevIndex = (projectIndex - 1 + regionProjects.length) % regionProjects.length;
    setSelectedProject(regionProjects[prevIndex]);
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

  const imgFeats = [
    { imgClass: "project-Info__icon", imgSrc: "./assets/projectinfo/icons/bed.svg", imgAlt: "Bedroom Icon" }, 
    { imgClass: "project-Info__icon", imgSrc: "./assets/projectinfo/icons/bath.svg", imgAlt: "Bathroom Icon" },
    { imgClass: "project-Info__icon", imgSrc: "./assets/projectinfo/icons/parking.svg", imgAlt: "Carpark Icon" },
    { imgClass: "project-Info__icon", imgSrc: "./assets/projectinfo/icons/size.svg", imgAlt: "Size Icon" }
  ];

  const featObjs = [
    { data: `${(selectedProject?.bedroomMin === selectedProject?.bedroomMax) ? `${selectedProject?.bedroomMax}` : `${selectedProject?.bedroomMin} - ${selectedProject?.bedroomMax}`}`, imgFeat: imgFeats[0] },
    { data: `${(selectedProject?.bathroomMin === selectedProject?.bathroomMax) ? `${selectedProject?.bathroomMax}` : `${selectedProject?.bathroomMin} - ${selectedProject?.bathroomMax}`}`, imgFeat: imgFeats[1] },
    { data: `${((selectedProject?.carparkMin === null) && (selectedProject.carparkMax === null)) ? `-` : ((selectedProject?.carparkMin === selectedProject?.carparkMax) ? `${selectedProject?.carparkMax}` : `${selectedProject?.carparkMin} - ${selectedProject?.carparkMax}`)}`, imgFeat: imgFeats[2] },
    { data: `${(selectedProject?.sizeMin === selectedProject?.sizeMax) ? `${selectedProject?.sizeMax}` : `${selectedProject?.sizeMin} sqft - ${selectedProject?.sizeMax} sqft`}`, imgFeat: imgFeats[3] }
  ];

  return (
    <div className="project-Info">
      {isPhotoUI ? (
        <ProjectPhotos isLandmark={false} photos={photos} photoUIIndex={photoUIIndex} setPhotoUIIndex={setPhotoUIIndex} />
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
          <SeePhoto className01="project-Info__image" className02="project-Info__image-label" altName="Project Image" photos={photos} setIsPhotoUI={setIsPhotoUI} />
          <div className="project-Info__info1">
            <ProjectName isLandmark={false} name={selectedProject?.name ?? ""} prevLandmark={prevProject} nextLandmark={nextProject} />
            <GeoLocation isLandmark={false} location={selectedProject?.address ?? ""} />
            <div className="project-Info__wrapper">
              <ViewsNo no={selectedProject?.views ?? 0} />
              <LikesNo no={selectedProject?.likes ?? 0} />
              <ShareBtn isLandmark={false} clickShare={() => {}} />
            </div>
          </div>
          <ActionButtonsContainer actionItems={actionItems} />
          <div className="project-Info__info3">
            <div className="project-Info__specs">
              <PriceTag selectedProject={selectedProject} />
              <div className="project-Info__specs-wrapper">
                {[featObjs[0], featObjs[1], featObjs[2]].map((featObj) => (
                  <KeyValueSpec isLandmark={false} label="" data={featObj.data} img={featObj.imgFeat} />
                ))}
              </div>
              <KeyValueSpecWrap isLandmark={false} label="" data={featObjs[3].data} img={featObjs[3].imgFeat} />
              <KeyValueSpecWrap isLandmark={false} label="Tenure" data={selectedProject?.tenure ?? ""} />
              <KeyValueSpecWrap isLandmark={false} label="Completion Year" data={selectedProject?.year ?? ""} />
            </div>
          </div>
          <DescriptionBox isLandmark={false} titleLbl="Description" data={selectedProject?.description ?? ""} />
          <PerksListing isHighlight={true} objs={highlights} />
          <PerksListing isHighlight={false} objs={facilities} />
          <DeveloperBox className02="project-Info__developer-list" titleLbl={selectedProject?.developer} data={selectedProject?.developerDesc ?? ""} />
        </div>
      )}
      {isPhotoUI ? null : <InfoFooter isLandmark={false} purchaseMode={purchaseMode} selectedProject={selectedProject} />}
    </div>
  );
};

export default ProjectInfo;
