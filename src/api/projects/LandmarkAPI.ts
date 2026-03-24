import { fetchData } from "../ApiFunctions";
import { API_URL } from "../../commons/Constants";
import type { LandmarkModel } from "../landmarks/LandmarkModel";

export class LandmarkConstruct {

    constructLandmarkProfile(data: any) {
        const singLandmark: LandmarkModel = {
            id: data.id,
            placeId: data.placeId,
            name: data.name,
            landmarkName: data.landmarkName,
            coordinates: data.coordinates,
            completeTime: data.completeTime,
            highLight: data.highLight,
            height: data.height,
            description: data.description,
            floor: data.floor,
            photos: data.photos,
            official: data.official,
        };
        return singLandmark;
    }

}

export class LandmarkAPI {

    async fetchLandmarks(setLandmarksList: (landmarks: LandmarkModel[]) => void, location: string = "all", setSelectedLandmark: (landmark: LandmarkModel) => void, ) {
        let landmarkListInt = [];
        try {
            const res = await fetchData(`${API_URL}/fetch_landmarks.php?location=${location}`);
            console.log(`Res: ${JSON.stringify(res)}`);
            for (const landmark of res.data) {
                const singLandmark = (new LandmarkConstruct()).constructLandmarkProfile(landmark);
                landmarkListInt.push(singLandmark);
            }
            setLandmarksList(landmarkListInt);
            setSelectedLandmark(landmarkListInt[0]);
        } catch (error) {
            console.error("Error fetching data:", error);
            throw new Error("Failed to fetch data");
        }
    }

}
