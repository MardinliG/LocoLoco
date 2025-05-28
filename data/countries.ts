export interface Country {
    name: string;
    coordinates: [number, number];
    color: string;
}

export const countries: Country[] = [
    {
        name: "France",
        coordinates: [2.2137, 46.2276],
        color: "#1e3a8a"
    },
    {
        name: "Italy",
        coordinates: [12.5674, 41.8719],
        color: "#1e3a8a"
    },
    {
        name: "Spain",
        coordinates: [-3.7038, 40.4168],
        color: "#1e3a8a"
    },
    {
        name: "United Kingdom",
        coordinates: [-0.1278, 51.5074],
        color: "#1e3a8a"
    },
    {
        name: "United States",
        coordinates: [-95.7129, 37.0902],
        color: "#1e3a8a"
    },
    {
        name: "Japan",
        coordinates: [138.2529, 36.2048],
        color: "#1e3a8a"
    },
    {
        name: "Brazil",
        coordinates: [-51.9253, -14.2350],
        color: "#1e3a8a"
    },
    {
        name: "Australia",
        coordinates: [133.7751, -25.2744],
        color: "#1e3a8a"
    }
]; 