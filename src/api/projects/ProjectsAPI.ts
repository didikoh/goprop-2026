import { fetchData } from "../../api/ApiFunctions";
import type { ProjectModel } from "./ProjectModel";
import { API_URL } from "../../commons/Constants";

export class ProjectConstruct {

    constructProjectProfile(data: any) {
        const singProject: ProjectModel = {
            id: data.id,
            placeId: data.placeId,
            name: data.name,
            status: data.status,
            description: data.description,
            address: data.address,
            website: data.website,
            golink: data.golink,
            price: data.price,
            videos: data.videos,
            panoramas: data.panoramas,
            interior: data.interior,
            developer: data.developer,
            type: data.type,
            tenure: data.tenure,
            units: data.units,
            sizeMin: data.sizeMin,
            sizeMax: data.sizeMax,
            year: data.year,
            bedroomMin: data.bedroomMin,
            bedroomMax: data.bedroomMax,
            bathroomMin: data.bathroomMin,
            bathroomMax: data.bathroomMax,
            carparkMin: data.carparkMin,
            carparkMax: data.carparkMax,
            priceFromMin: data.priceFromMin,
            priceFromMax: data.priceFromMax,
            rentPriceMin: data.rentPriceMin,
            rentPriceMax: data.rentPriceMax,
            developerDesc: data.developerDesc,
            highlights: data.highlights,
            facilities: data.facilities,
            views: data.views,
            likes: data.likes,
            coordinates: data.coordinates,
            region: data.region,
            regionLong: data.regionLong,
            chatbot_state: data.chatbot_state,
        };
        return singProject;
    }

}

export class ProjectAPI {

    async fetchProjects(setProjectsList: (projects: ProjectModel[]) => void, location: string = "all") {
        let projectsListInt = [];
        try {
            const res = await fetchData(`${API_URL}/fetch_projects.php?location=${location}`);
            console.log(`Res: ${JSON.stringify(res)}`);
            for (const project of res.data) {
                const singProject = (new ProjectConstruct()).constructProjectProfile(project);
                projectsListInt.push(singProject);
            }
            setProjectsList(projectsListInt);
        } catch (error) {
            console.error("Error fetching data:", error);
            throw new Error("Failed to fetch data");
        }
    }

}
