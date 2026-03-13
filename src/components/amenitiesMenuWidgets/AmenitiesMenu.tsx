import { useEffect, useRef, useState } from 'react'
import './styles/AmenitiesMenu.css';
// import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { API_URL } from '../../commons/Constants';

interface TrainLine {
    id: string;
    color: string;
    label: string;
}

interface AmenitiesLabelProperties {
    name: string,
    iconPath: string,
    mapURL: string,
}

interface AmenitiesProp {
    location: string;
    subMenu: string;
    distance: number;
    amenities: string;
    setAmenities: (menu: string) => void;
}

const AmenitiesMenu = ({ location, subMenu, distance, amenities, setAmenities }: AmenitiesProp) => {
    //const { location, subMenu, amenities, setAmenities, distance, API_URL, applyAmenities } = useAppContext();
    const [amenitiesSubValue, setAmenitiesSubValue] = useState<string>('');
    const [filterTransport, setFilterTransport] = useState<boolean>(false);
    const applyAmenities = useRef<(() => void) | null>(null);

    function toggleAmenity(id: string) {
        if (id == amenities) {
            setAmenities('');
            setFilterTransport(false);
            return;
        } else {
            setAmenitiesSubValue('');
            setAmenities(id);
        }

        if (id === 'transport' && location != "genting") {
            setFilterTransport(true);
        } else {
            setFilterTransport(false);
        }
    }

    const trainLines: Record<string, TrainLine[]> = {
        kl: [
            { id: "KTM Seremban Line", color: "#0168b3", label: "KTM" },
            { id: "MRT Sg Buloh - Kajang Line", color: "#00843d", label: "MRT" },
            { id: "MRT Laluan Putrajaya", color: "#fed105", label: "MRT" },
            { id: "LRT Ampang Line", color: "#f4901d", label: "LRT" },
            { id: "LRT Kelana Jaya Line", color: "#ed154e", label: "LRT" },
            { id: "KL Monorail Line", color: "#8bc63e", label: "Mono" },
        ],
        jb: [
            { id: "JB-Bus", color: "#9BA2E4", label: "BUS" },
            { id: "JB-Train", color: "#9BA2E4", label: "RTS" },
        ],
        // Add more locations and their respective train lines as needed
    };

    const lines = trainLines[location] || []; // Default to an empty array if location not found

    const toggleFilter = (id: string) => {
        if (id == amenitiesSubValue) {
            setAmenitiesSubValue('');
            setAmenities('transport');
            return;
        }
        setAmenitiesSubValue(id);
        setAmenities("transport");
    }

    useEffect(() => {
        if (amenities == '') {
            toggleAmenityAnnotation(amenities, '', true);
            setFilterTransport(false);
        } else {
            toggleAmenityAnnotation(amenities, amenitiesSubValue, false);
        }
    }, [amenities, distance, amenitiesSubValue]);

    async function toggleAmenityAnnotation(type: string, transportId?: string, disable: boolean = false) {
        let result: any;
        if (disable) {
            //if (applyAmenities.current) applyAmenities.current(type, []);
            return;
        }
        try {
            const response = await axios.post(
                `${API_URL}/fetch_amenities.php`,
                {
                    location: location,
                    amenity: type,
                }
            );
            if (response.data.success) {
                console.log(`Amenities = ${JSON.stringify(response.data.data)}`);
                
                result = response.data.data;
            } else {
                console.error(response.data.message || "Failed to fetch amenities.");
            }
        } catch (err: any) {
            console.error(
                "An error occurred while fetching amenities: " + err.message
            );
        }

        let amenitiesLabelsInfo: AmenitiesLabelProperties[] = [];
        let iconPath = "../../assets/topmenu/amenities/" + type + ".svg";

        result.forEach((element: any) => {
            const amenitiesMapUrl = decodeURIComponent(element.mapIframeUrl)
            if (type == "transport") {
                if (transportId != "") {
                    if (element.line != transportId) return; // Skip if line does not match
                }
                iconPath = "../../assets/topmenu/trainSVG/" + element.line + ".svg";
                amenitiesLabelsInfo.push({
                    name: element.name,
                    iconPath: iconPath,
                    mapURL: amenitiesMapUrl
                });
            } else {
                amenitiesLabelsInfo.push({
                    name: element.name,
                    iconPath: type == 'embassy' ? "../../" + element.flagSVGPath : iconPath,
                    mapURL: amenitiesMapUrl
                });
            }
        })
        //if (applyAmenities.current) applyAmenities.current(type, amenitiesLabelsInfo, distance);

    }

    return (
        <div className='amenities-menu'>
            {(filterTransport) ? <div className={`amenities-btns`}>
                {lines.map(({ id, color, label }) => (
                    <button key={id} id={id} className={`amenities-btn ${amenitiesSubValue === id ? 'active' : ''}`} onClick={() => toggleFilter(id)}>
                        <img
                            className="train-filter-svg"
                            src={`./assets/topmenu/trainSVG/${id}.svg`}
                            alt={label}
                        />
                        <span id="train-filter-span" style={{ color }}>{label}</span>
                        <div className={`indicator ${amenitiesSubValue === id ? 'active' : ''}`}></div>
                    </button>
                ))}
            </div> : null}
            <div className={`amenities-btns ${subMenu === "amenities" ? "" : "slide-out-amenities"}`} id="amenities-btns" >
                {[
                    { id: "shopping", icon: "shopping.svg", label: "Mall" },
                    { id: "transport", icon: location === "genting" ? "bus.svg" : "transport.svg", label: "Transport" },
                    { id: "airport", icon: "airport.svg", label: "Airport" },
                    { id: "medical", icon: "medical.svg", label: "Medical" },
                    {
                        id: "education",
                        icon: "education.svg",
                        label: "Education",
                    },
                    { id: "embassy", icon: "embassy.svg", label: "Embassy" },
                ].filter(({ id }) => !(location === "genting" && id === "embassy")).map(({ id, icon, label }) => (
                    <button key={id} className={`amenities-btn ${amenities === id ? 'active' : ''}`} id={id} onClick={() => { toggleAmenity(id); }}>
                        <img src={`./assets/topmenu/amenities/${icon}`} alt={label} />
                        <span>{label}</span>
                        <div className={`indicator ${amenities === id ? 'active' : ''}`}></div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default AmenitiesMenu;
