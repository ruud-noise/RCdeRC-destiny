
export interface TripParameters {
  distanceToRotterdam: number; // 0 to 10000 km
  terrain: number; // 0 (Flat) to 10 (High Alps)
  bigMacIndex: number; // 0 (Cheap) to 20 (Expensive)
  sunnyWeatherChance: number; // 0 to 100%
  additionalInput: string;
}

export interface LocationResult {
  name: string;
  reason: string;
  mapUrl?: string;
  googleMapsLinks?: Array<{
    title: string;
    uri: string;
  }>;
}
