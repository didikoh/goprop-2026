import "./styles/InteractSelect.css";
import { useProjectDataStore, useProjectStore } from "../../stores/projectStore";
import { useExtIframeStore } from "../../stores/externalIframeStore";
import { keyplanUrl } from "../../commons/Constants";
import { useBottomMenuStore } from "../../stores/bottomMenuStore";
import { useSideMenuStore } from "../../stores/sideMenuStore";

interface InteractFABProp {
    enabled: boolean;
    url: string;
    label: string;
    imgLabel: string;
    labelString: string;
    paramA: number;
    paramB: number;
    p_location: boolean;
    p_virtual_tour: boolean;
    p_floor_plan: boolean;
    p_video: boolean;
}

function InteractFAB({ enabled, url, label, imgLabel, labelString, paramA, paramB, p_location, p_virtual_tour, p_floor_plan, p_video }: InteractFABProp) {
    const { setProjectData } = useProjectDataStore();
    const { setExternalIframeUrl } = useExtIframeStore();
    const { selectedMenu: bottomMenu, setSelectedMenu: setBottomMenu } = useBottomMenuStore();
    const { selectedMenu: sideMenu, setSelectedMenu: setSideMenu } = useSideMenuStore();
    const { setProject: setSelectedProject } = useProjectStore();

    return (
        <div>
            <div
                className={`interact-dot-container ${label} ${enabled ? "" : "disabled"}`}
                style={{ top: `calc(50vh + ${paramA}px)` }}
                onClick={() => {
                    if (label != 'close') {
                        setProjectData((prevData: any) => {
                            if (p_location) { return { ...prevData, p_location: prevData.p_location + 1, }; }
                            if (p_virtual_tour) { return { ...prevData, p_virtual_tour: prevData.p_virtual_tour + 1, }; }
                            if (p_floor_plan) { return { ...prevData, p_floor_plan: prevData.p_floor_plan + 1, }; }
                            if (p_video) { return { ...prevData, p_video: prevData.p_video + 1, }; }
                        });
                        setExternalIframeUrl(url || "./construction/index.html");
                    } else {
                        setSelectedProject(null);
                        setBottomMenu("home");
                        setSideMenu("region");
                    }
                }}
            >
                <img className="interact-dot-icon" src={`./assets/interactdot/${imgLabel}.svg`} />
            </div>
            <div
                className={`interact-dot-context ${enabled ? "" : "disabled"}`}
                style={{ top: `calc(50vh + ${paramB}px)` }}
            >
                {labelString}
            </div>
        </div>
    );
}

const InteractSelect = () => {
    const { project: selectedProject, setProject: setSelectedProject } = useProjectStore();

  return (
    <>
      {selectedProject && (
        <div className="interact-dots-container" id="interact-dots-container">
            <InteractFAB enabled={(selectedProject?.panoramas != null)} url={selectedProject?.panoramas ?? ''} label={'location'} imgLabel={'location'} labelString={'Location'} paramA={-200} paramB={-190} p_location={true} p_virtual_tour={false} p_floor_plan={false} p_video={false} />
            <InteractFAB enabled={(selectedProject?.interior != null)} url={selectedProject?.interior ?? ''} label={'360'} imgLabel={'360'} labelString={'Virtual Tour'} paramA={-120} paramB={-110} p_location={false} p_virtual_tour={true} p_floor_plan={false} p_video={false} />
            <InteractFAB enabled={(selectedProject?.name != null)} url={keyplanUrl + (selectedProject?.name ?? '')} label={'keyplan'} imgLabel={'floor-plan'} labelString={'Floor Plan'} paramA={-40} paramB={-30} p_location={false} p_virtual_tour={false} p_floor_plan={true} p_video={false} />
            <InteractFAB enabled={(selectedProject?.videos != null)} url={selectedProject?.videos ?? ''} label={'video'} imgLabel={'video'} labelString={'Video'} paramA={40} paramB={50} p_location={false} p_virtual_tour={false} p_floor_plan={false} p_video={true} />
            <InteractFAB enabled={true} url={''} label={'close'} imgLabel={'close-focus'} labelString={'Close'} paramA={120} paramB={130} p_location={false} p_virtual_tour={false} p_floor_plan={false} p_video={false} />
        </div>
      )}
    </>
  );
};

export default InteractSelect;
