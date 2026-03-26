import "./styles/LandMarkInfo.css";
import { useEffect, useState } from "react";
import { usePhotoUIIndStore, useUIPhotoStore } from "../../stores/uiPhotoStore";
import { useLandmarkArrStore, useLandmarkStore } from "../../stores/landmarkStore";
import { useExtIframeStore } from "../../stores/externalIframeStore";
import { useExtOverlayStore } from "../../stores/externalOverlayStore";
import { SeePhoto } from "./commonWidgets/SeePhoto";
import { GeoLocation } from "./commonWidgets/GeoLocation";
import { ShareBtn } from "./commonWidgets/ShareBtn";
import { KeyValueSpecWrap } from "./commonWidgets/KeyValueSpec";
import { DescriptionBox } from "./commonWidgets/DescriptionBox";
import { ProjectName } from "./commonWidgets/ProjectName";
import { InfoFooter } from "./commonWidgets/InfoFooter";
import { ProjectPhotos } from "./ProjectPhotos";
import { HighlightsBox } from "./commonWidgets/LikesNViews";

const LandMarkInfo = () => {
    const { isPhotoUI, setIsPhotoUI } = useUIPhotoStore();
    const { photoUIIndex, setPhotoUIIndex } = usePhotoUIIndStore();
    const { landmarks } = useLandmarkArrStore();
    const { selectedLandmark, setSelectedLandmark } = useLandmarkStore();
    const { setIsExternalOverlay } = useExtOverlayStore();
    const { setExternalIframeUrl } = useExtIframeStore();

  const [photos, setPhotos] = useState<string[]>([]);
  const [nextLandmarkTimeout, setNextLandmarkTimeout] = useState<number | null>(
    null
  );

  const errorPhoto = (e: any) => {
    (e.target as HTMLImageElement).src = "./assets/placeholder-image.webp";
  };
  
  const nextLandmark = () => {
    if (nextLandmarkTimeout || !landmarks) return;
    const landmarkIndex = landmarks.findIndex(
      (landmark: any) => landmark.id === selectedLandmark?.id
    );
    const nextIndex = (landmarkIndex + 1) % landmarks.length;
    setSelectedLandmark(landmarks[nextIndex]);
    // if (focusTargetRef.current) {
    //   focusTargetRef.current(landmarks[nextIndex].name);
    // }
    setNextLandmarkTimeout(
      window.setTimeout(() => setNextLandmarkTimeout(null), 1200)
    );
  };

  const prevLandmark = () => {
    if (nextLandmarkTimeout || !landmarks) return;
    const landmarkIndex = landmarks.findIndex(
      (landmark: any) => landmark.id === selectedLandmark?.id
    );
    const prevIndex = (landmarkIndex - 1 + landmarks.length) % landmarks.length;
    setSelectedLandmark(landmarks[prevIndex]);
    // if (focusTargetRef.current) {
    //   focusTargetRef.current(landmarks[prevIndex].name);
    // }
    setNextLandmarkTimeout(
      window.setTimeout(() => setNextLandmarkTimeout(null), 1200)
    );
  };
  

  const handleOfficialWebsiteClick = () => {
    if (selectedLandmark?.official) {
      window.open(selectedLandmark.official, "_blank");
    }
  };

  const handleLocationClick = () => {
    if (selectedLandmark?.coordinates) {
      const [lat, lng] = selectedLandmark.coordinates.split(", ");
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      setExternalIframeUrl(googleMapsUrl);
    }
  };

  const handleShareClick = () => {
    setIsExternalOverlay(true);
  };

  const actionItems = {
    location: {
      icon: "./assets/projectinfo/icons/interact-dot/location.svg",
      label: "Location",
      onClick: handleLocationClick,
      disabled: !selectedLandmark?.coordinates,
    },
    website: {
      icon: "./assets/projectinfo/icons/interact-dot/sm.png",
      label: "Official Site",
      onClick: handleOfficialWebsiteClick,
      disabled: !selectedLandmark?.official,
    },
  };

  useEffect(() => {
    if (selectedLandmark?.photos) {
      // Generate photo URLs based on the photos path
      const photoUrls = selectedLandmark.photos.split(', ');
      console.log(`selectedLandmark = ${JSON.stringify(selectedLandmark)}`);
      setPhotos(photoUrls);
    }
  }, [selectedLandmark]);

  if (!selectedLandmark) {
    return <div className="landmark-info">No landmark selected</div>;
  }
  
  return (
    <div className="landmark-info">
      {isPhotoUI ? (
        <ProjectPhotos isLandmark={true} photos={photos} photoUIIndex={photoUIIndex} setPhotoUIIndex={setPhotoUIIndex} onError={errorPhoto} />
      ) : 
      (
        <div className="landmark-info__details">
          <SeePhoto className01="landmark-info__image" className02="landmark-info__image-label" altName="Landmark Image" photos={photos} setIsPhotoUI={setIsPhotoUI} onError={errorPhoto} />

          <div className="landmark-info__info1">
            <ProjectName isLandmark={true} name={selectedLandmark?.landmarkName ?? ""} prevLandmark={prevLandmark} nextLandmark={nextLandmark} />
            <GeoLocation isLandmark={true} location={selectedLandmark?.landmarkName ?? ""} />
            <div className="landmark-info__wrapper">
              <HighlightsBox highLight={selectedLandmark?.highLight} />
              <ShareBtn isLandmark={true} clickShare={handleShareClick} />
            </div>
          </div>

          <div className="landmark-info__info2">
            <div className="landmark-info__specs">
              <KeyValueSpecWrap isLandmark={true} label="Height" data={selectedLandmark?.height ?? ""} />
              <KeyValueSpecWrap isLandmark={true} label="Floors" data={selectedLandmark?.floor ?? ""} />
              <KeyValueSpecWrap isLandmark={true} label="Completion" data={selectedLandmark?.completeTime ?? ""} />
            </div>
          </div>
          <DescriptionBox isLandmark={true} data={selectedLandmark?.description ?? ""} />
        </div>
      )}
      <InfoFooter isLandmark={true} selectedLandmark={selectedLandmark} handleOnClick={handleOfficialWebsiteClick} />
    </div>
  );
};

export default LandMarkInfo;
