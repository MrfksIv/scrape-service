export interface GMapsInfo {
    plus_code?: {
        compound_code?: string;
    }
    results? : Result[]
}

interface Result {
    geometry: {
        bounds: {
            northeast: LatLng;
            southwest: LatLng;
        }
    }
}

interface LatLng {
    lat: number;
    lng: number;
}
