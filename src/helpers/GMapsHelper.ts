import { default as axios } from 'axios';
import {GMapsInfo, Location} from '../entities';
import * as winston from "winston";

export async function getGMapsInfoFromLocation(location: Location): Promise<GMapsInfo | null> {
    const gmapsEndpoint = process.env.G_MAPS_API_ENDPOINT;
    const apiKey = process.env.G_MAPS_API_KEY;

    if (!gmapsEndpoint || !apiKey) {
        winston.error('GMapsHelper.getGMapsInfoFromLocation: Missing GoogleMaps API-Key and/or endpoint');
        return null;
    }

    const url = `${gmapsEndpoint}=${location.lat},${location.lon}&key=${apiKey}`;

    try {
        const locationInfo = await axios.get(url);
        return locationInfo.data;
    } catch (error) {
        winston.error('GMapsHelper.getGMapsInfoFromLocation:', error);
        return null;
    }
}

export function getBoundingBoxFromLocations(locations: Location[]): null | number[] {

    // single point, no bounded box available
    if (locations.length <= 1){
        return null;
    }

    // two points is already a bounded box, just return that
    if (locations.length === 2) {
        const points: number[][] = locations.map((loc) => [loc.lat, loc.lon]);
        return points.flat();
    }

    // for more than two points find the min and max
    const latsArray = locations.map((loc) => loc.lat);
    const lonsArray = locations.map((loc) => loc.lon);

    const minLat = Math.min(...latsArray);
    const maxLat = Math.max(...latsArray);

    const minLon = Math.min(...lonsArray);
    const maxLon = Math.max(...lonsArray);

    return [minLat, minLon, maxLat, maxLon];

}
