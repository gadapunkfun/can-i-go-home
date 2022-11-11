import { defineStore } from "pinia";
import type { Departure } from "@/models/Departure";
import type { DepartureBoard } from "@/models/DepartureBoard";
import { GetDomkyrkanDepartures } from "@/services/VasttrafikAPI";

interface State {
	departureBoard?: DepartureBoard;
	departures: Departure[];
	isLoading: boolean;
}

export const useTimeTableStore = defineStore("timeTable", {
	state: (): State => ({
		departureBoard: undefined,
		departures: [] as Departure[],
		isLoading: true
	}),
	actions: {
		async getDomkyrkandDepartures() {
			if (this.$state.departureBoard === undefined || this.$state.departures.length <= 3) {
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

