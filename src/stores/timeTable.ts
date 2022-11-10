import { defineStore } from "pinia";
import { prop, sortBy } from "ramda";
import { GetDomkyrkanToBruns, GetDomkyrkanToGron, type Departure, type DepartureBoard } from "@/services/VasttrafikAPI";

interface State {
	departureBoardA?: DepartureBoard;
	departureBoardB?: DepartureBoard;
	sortedDeparturesA: Departure[];
	sortedDeparturesB: Departure[];
	isLoading: boolean;
}

export const useTimeTableStore = defineStore("timeTable", {
	state: (): State => ({
		departureBoardA: undefined, // A Towards Brunsparken
		departureBoardB: undefined, // B Towards Gronsaks
		sortedDeparturesA: [] as Departure[], // A Towards Brunsparken
		sortedDeparturesB: [] as Departure[], // B Towards Gronsaks
		isLoading: true
	}),
	actions: {
		async setSortedDeparturesA() {
			if (this.$state.departureBoardA === undefined) {
				const resp = await GetDomkyrkanToBruns();
				if (resp.isSuccessStatusCode && resp.result) {
					this.$state.departureBoardA = resp.result.DepartureBoard;
				}
			}
			this.$state.sortedDeparturesA = this.$state.departureBoardA!.Departure.filter(d => d.track === "A");
		},
		async setSortedDeparturesB() {
			if (this.$state.departureBoardB === undefined) {
				const resp = await GetDomkyrkanToGron();
				if (resp.isSuccessStatusCode && resp.result) {
					this.$state.departureBoardB = resp.result.DepartureBoard;
				}
			}
			this.$state.sortedDeparturesB = this.$state.departureBoardB!.Departure.filter(d => d.track === "B");
		}
	}
});

