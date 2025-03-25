import haversine from 'haversine-distance';

export const calculateDistance = (loc1, loc2) => haversine(loc1, loc2);