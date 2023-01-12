export type DropdownCityNames = GeoCodingAPI[]

export interface LocalNames {
    en?: string
    zh?: string
    ascii?: string
    feature_name?: string
    be?: string
    ru?: string
    de?: string
}

export interface GeoCodingAPI {
    name: string;
    local_names?: LocalNames;
    lat: number;
    lon: number;
    country: string;
    state: string;
}

