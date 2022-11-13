import { defineStore } from "pinia";
import type { DepartureBoard } from "@/models/DepartureBoard";
import { GetDomkyrkanDepartures } from "@/services/VasttrafikAPI";
import type { Departure, DeparturesWithGroupedDepartureTime } from "@/models/Departure";

interface State {
	isLoading: boolean;
	departures: Departure[];
	departureBoard?: DepartureBoard;
	departuresGroupedA: DeparturesWithGroupedDepartureTime[];
	departuresGroupedB: DeparturesWithGroupedDepartureTime[];
}

export const useTimeTableStore = defineStore("timeTable", {
	state: (): State => ({
		departures: [],
		isLoading: true,
		departuresGroupedA: [],
		departuresGroupedB: [],
		departureBoard: undefined
	}),
	actions: {
		async getDomkyrkandDepartures() {
			const nrOfDeparturesGroupedA =
				this.$state.departuresGroupedA.length + this.$state.departuresGroupedB.length;
			if (
				this.$state.departureBoard === undefined ||
				this.$state.departures.length <= 6 ||
				nrOfDeparturesGroupedA <= 9
			) {
				const resp = await GetDomkyrkanDepartures();
				if (resp.isSuccessStatusCode && resp.result) {
					this.$state.departureBoard = resp.result.DepartureBoard;
				}
			}
			this.$state.departures = this.$state.departureBoard!.Departure;
			this.$state.isLoading = false;
		}
	}
});

