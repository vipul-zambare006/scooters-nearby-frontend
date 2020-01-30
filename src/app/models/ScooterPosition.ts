export interface Geometry {
    type: string;
    coordinates: number[];
}

export interface Feature {
    type: string;
    geometry: Geometry;
}

export interface ScooterPosition {
    type: string;
    features: Feature[];
}
