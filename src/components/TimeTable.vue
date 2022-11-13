<template>
	<h3
		class="q-my-none q-px-md q-pt-md q-pb-none text-white"
		:class="{ candyCaneText: currentTheme === 'holiday', 'text-white': currentTheme === 'default' }"
	>
		{{ currentTime }}
	</h3>
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
			v-for="(departure, i) in departuresGroupedA"
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
							{{ getHumanReadableDepartureTime(departure.departureTimesFormatted) }}
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
			v-for="(departure, i) in departuresGroupedB"
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
							{{ getHumanReadableDepartureTime(departure.departureTimesFormatted) }}
						</h6>
					</div>
				</div>
			</q-card-section>
		</q-card>
	</template>
	<div v-if="currentTheme === 'christmas'" id="winterWonderland">
		<q-icon v-for="(snowflake, i) in 50" :key="i" class="text-h1 text-white" name="mdi-snowflake mdi-rotate-315" />
	</div>
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import { useRoute } from "vue-router";
	import { values, groupBy, prop } from "ramda";
	import { ref, onMounted, onUnmounted } from "vue";
	import { useTimeTableStore } from "@/stores/timeTable";
	import { QCard, QCardSection, QSkeleton, QIcon } from "quasar";
	import { DeparturesWithGroupedDepartureTime, type Departure } from "@/models/Departure";

	const timeTableStore = useTimeTableStore();
	const { departureBoard, departures, departuresGroupedA, departuresGroupedB, isLoading } = storeToRefs(
		useTimeTableStore()
	);
	const intervalId = ref<number | null>(null);
	const currentTime = ref<string>();
	const currentTheme = ref<string>(
		(useRoute().params.theme as string) === "" ? "default" : (useRoute().params.theme as string)
	);

	const getHumanReadableDepartureTime = (departureTimesFormatted: number[]) => {
		if (departureTimesFormatted) {
			const sumOfDepartureTimes = departureTimesFormatted.reduce((a, b) => a + b, 0);
			if (departureTimesFormatted.length === 1 && sumOfDepartureTimes > 0) {
				return `Leaves in ${departureTimesFormatted[0]} minutes`;
			} else if (departureTimesFormatted.length > 1 && sumOfDepartureTimes > 0) {
				return `Leaves in ${departureTimesFormatted[0]} minutes, next one leaves in ${departureTimesFormatted[1]} minutes`;
			} else {
				return "This transport is departing or has departed...";
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
		const getUpComingDepartures = (departures: DeparturesWithGroupedDepartureTime[]) => {
			return departures.map(departure => {
				const upComingDepartures = departure.departureTimes.filter(t => {
					const departureTime = new Date();
					departureTime.setHours(parseInt(t.split(":")[0]));
					departureTime.setMinutes(parseInt(t.split(":")[1]));
					return departureTime.getTime() > currentDate.getTime();
				});
				departure.departureTimes = upComingDepartures;
				return departure;
			});
		};
		timeTableStore.$patch(state => {
			state.departuresGroupedA = getUpComingDepartures(departuresGroupedA.value);
			state.departuresGroupedB = getUpComingDepartures(departuresGroupedB.value);
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
		const groupDeparturesFunc = (arr: Departure[]) => values(groupBy<Departure, string>(prop("sname"))(arr));
		const departuresA = groupDeparturesFunc(departures.value.filter(d => d.track === "A"));
		const departuresB = groupDeparturesFunc(departures.value.filter(d => d.track === "B"));
		const createGroupedDepartures = (departures: Departure[][]) => {
			const newDeparturesGrouped: DeparturesWithGroupedDepartureTime[] = [];
			departures.forEach(departure => {
				const newDepartureGrouped = new DeparturesWithGroupedDepartureTime(departure[0]);
				if (departure.length > 1) {
					departure.slice(1, departure.length).forEach(d => newDepartureGrouped.departureTimes.push(d.time));
				}
				newDeparturesGrouped.push(newDepartureGrouped);
			});
			return newDeparturesGrouped;
		};
		departuresGroupedA.value = createGroupedDepartures(departuresA);
		departuresGroupedB.value = createGroupedDepartures(departuresB);
		cleanUpDeparted();
		intervalId.value = window.setInterval(cleanUpDeparted, 1000 * 60);
	});

	onUnmounted(() => {
		clearInterval(intervalId.value ?? 0);
	});
</script>

<style lang="scss" scoped>
	.candyCaneText {
		--color1: #217427;
		--color2: #ff0a0a;
		font-weight: 700;
		background: repeating-linear-gradient(
			45deg,
			var(--color1),
			var(--color1) 30px,
			var(--color2) 30px,
			var(--color2) 60px
		);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}

	#winterWonderland {
		width: 100%;
		height: 100%;
		position: absolute;
		bottom: 0;
		z-index: -1;
		white-space: initial;
		i {
			width: 400px;
			height: 100px;
		}
	}
</style>
