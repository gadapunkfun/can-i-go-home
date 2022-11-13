<template>
	<h3 class="q-my-none q-px-md q-pt-md q-pb-none text-white">{{ currentTime }}</h3>
	<q-card v-if="isLoading" flat square class="bg-transparent">
		<q-card-section horizontal>
			<div class="row justify-between full-width">
				<q-skeleton type="text" height="100px" width="10%" class="text-h4" />
				<q-skeleton type="text" width="50%" class="text-h4" />
				<q-skeleton type="text" width="35%" class="text-h4" />
			</div>
		</q-card-section>
	</q-card>
	<template v-else>
		<div class="row justify-between q-px-md">
			<h3 class="text-positive q-mb-auto">Domkyrkan A</h3>
			<q-icon class="text-h1 text-positive" name="mdi-bus-stop-uncovered" />
		</div>
		<q-card
			class="q-my-xs animate__animated animate__flipInX animate__slow"
			v-for="(departure, i) in departuresA"
			flat
			square
			:key="i"
			:style="'background-color: ' + departure.bgColor"
		>
			<q-card-section horizontal>
				<div class="row justify-between full-width">
					<div class="row">
						<h4 class="q-px-md q-mr-md" :style="'width: 80px; color: ' + departure.fgColor">
							{{ departure.sname }}
						</h4>
						<h4 class="q-my-auto" :style="'color: ' + departure.fgColor">
							{{ departure.direction }}
						</h4>
					</div>
					<div class="row">
						<q-icon
							class="text-h2 q-my-auto q-pr-md"
							:name="departure.type === 'BUS' ? 'mdi-bus-side' : 'mdi-tram'"
							:style="'color: ' + departure.fgColor"
						></q-icon>
						<h6 class="q-pr-md" :style="'color: ' + departure.fgColor">
							{{ getHumanReadableDepartureTime(departure.departureTimes) }}
						</h6>
					</div>
				</div>
			</q-card-section>
		</q-card>
		<div class="row justify-between q-px-md">
			<h3 class="text-positive q-mb-auto">Domkyrkan B</h3>
			<q-icon class="text-h1 text-positive" name="mdi-bus-stop-uncovered" />
		</div>
		<q-card
			class="q-my-xs"
			v-for="(departure, i) in departuresB.slice(0, 6)"
			flat
			square
			:key="i"
			:style="'background-color: ' + departure.bgColor"
		>
			<q-card-section horizontal>
				<div class="row justify-between full-width">
					<div class="row">
						<h4 class="q-px-md q-mr-md" :style="'width: 80px; color: ' + departure.fgColor">
							{{ departure.sname }}
						</h4>
						<h4 class="q-my-auto" :style="'color: ' + departure.fgColor">
							{{ departure.direction }}
						</h4>
					</div>
					<div class="row">
						<q-icon
							class="text-h2 q-my-auto q-pr-md"
							:name="departure.type === 'BUS' ? 'mdi-bus-side' : 'mdi-tram'"
							:style="'color: ' + departure.fgColor"
						></q-icon>
						<h4 class="q-pr-md" :style="'color: ' + departure.fgColor">
							{{ getHumanReadableDepartureTime(departure.time) }}
						</h4>
					</div>
				</div>
			</q-card-section>
		</q-card>
	</template>
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import { useRoute } from "vue-router";
	import { useTimeTableStore } from "@/stores/timeTable";
	import { ref, onMounted, onUnmounted, computed } from "vue";
	import { QCard, QCardSection, QSkeleton, QIcon } from "quasar";
	import type { DepartureGroupedDepartureTime } from "@/models/Departure";

	const timeTableStore = useTimeTableStore();
	const { departureBoard, departures, departuresGrouped, isLoading } = storeToRefs(useTimeTableStore());
	const intervalId = ref<number | null>(null);
	const currentTime = ref<string>();
	const currentTheme = ref<string>(
		(useRoute().params.theme as string) === "" ? "default" : (useRoute().params.theme as string)
	);

	const departuresA = computed(() => {
		return departuresGrouped.value.filter(d => d.track === "A");
	});
	const departuresB = computed(() => {
		return departuresGrouped.value.filter(d => d.track === "B");
	});

	const getHumanReadableDepartureTime = (departureTime: string[]) => {
		if (departureTime.length > 0) {
			const currentDate = new Date();
			const departureDate = new Date();
			departureDate.setHours(parseInt(departureTime[0].split(":")[0]));
			departureDate.setMinutes(parseInt(departureTime[0].split(":")[1]));
			const departsInInMS = departureDate.getTime() - currentDate.getTime();
			const departsInInMin = Math.round(departsInInMS / 60_000);

			if (departureTime.length > 1) {
				const departureDateNext = new Date();
				departureDateNext.setHours(parseInt(departureTime[0].split(":")[0]));
				departureDateNext.setMinutes(parseInt(departureTime[0].split(":")[1]));
				const departsNextInInMS = departureDate.getTime() - currentDate.getTime();
				const departsNextInInMin = Math.round(departsNextInInMS / 60_000);
				return `Leaves in ${departsInInMin} minutes, next one leaves in ${departsNextInInMin} minutes`;
			} else {
				if (departsInInMin <= 0) return "Is leaving or has left...";
				return `Leaves in ${departsInInMin} minutes`;
			}
		} else {
			return "This transport is done for the day";
		}
	};

	setInterval(() => {
		currentTime.value = new Date().toLocaleTimeString("se-SV", {
			hour: "2-digit",
			minute: "2-digit",
			second: "numeric"
		});
	}, 1000);

	function removeAlreadyDeparted() {
		const currentDate = new Date();
		const upComingDeparturesGrouped = departuresGrouped.value.map(d => {
			const upComingDepartures = d.departureTimes.filter(t => {
				const departureTime = new Date();
				departureTime.setHours(parseInt(d.time.split(":")[0]));
				departureTime.setMinutes(parseInt(d.time.split(":")[1]));
				return departureTime.getTime() > currentDate.getTime();
			});
			d.departureTimes = upComingDepartures;
			return d;
		});
		timeTableStore.$patch(state => {
			state.departuresGrouped = upComingDeparturesGrouped;
		});
	}
	const cleanUpDeparted = async () => {
		if (departureBoard === undefined || departures.value.length <= 6) {
			await timeTableStore.getDomkyrkandDepartures();
		}
		removeAlreadyDeparted();
	};

	onMounted(async () => {
		await timeTableStore.getDomkyrkandDepartures();
		departures.value.forEach(d => {
			const currentIndex = departuresGrouped.value.findIndex(dep => dep.sname === d.sname);
			if (currentIndex >= 0) {
		cleanUpDeparted();
		// intervalId.value = window.setInterval(cleanUpDeparted, 1000 * 60);
	});

	onUnmounted(() => {
		clearInterval(intervalId.value ?? 0);
	});
</script>

<style lang="css" scoped>
	.tramEmblem {
		width: 90px;
		height: 90px;
		font-size: 3rem;
		text-align: center;
		box-shadow: inset 0px 0px 0px 4px #ced4f4;
	}
</style>
