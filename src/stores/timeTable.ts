import { defineStore } from "pinia";
import type { Departure, DepartureGroupedDepartureTime } from "@/models/Departure";
import type { DepartureBoard } from "@/models/DepartureBoard";
import { GetDomkyrkanDepartures } from "@/services/VasttrafikAPI";

interface State {
	isLoading: boolean;
	departures: Departure[];
	departureBoard?: DepartureBoard;
	departuresGrouped: DepartureGroupedDepartureTime[];
}

export const useTimeTableStore = defineStore("timeTable", {
	state: (): State => ({
		departures: [],
		isLoading: true,
		departuresGrouped: [],
		departureBoard: undefined
	}),
	actions: {
		async getDomkyrkandDepartures() {
			if (this.$state.departureBoard === undefined || this.$state.departures.length <= 6) {
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

