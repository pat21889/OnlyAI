export type FacilityInput = {
  name: string;
  sportType: string;
  location: string;
  capacity: number;
  hourlyRate: number;
};

export type Facility = FacilityInput & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
