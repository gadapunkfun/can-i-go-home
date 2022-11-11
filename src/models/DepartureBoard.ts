import type { Departure } from "./Departure";

export interface DepartureBoard {
	noNamespaceSchemaLocation: string;
	servertime: string;
	serverdate: string;
	Departure: Departure[];
}
