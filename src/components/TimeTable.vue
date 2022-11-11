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
			v-for="(departure, i) in departuresA.slice(0, 6)"
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
					<h4 class="q-pr-md" :style="'color: ' + departure.fgColor">
						{{ getHumanReadableDepartureTime(departure.time) }}
					</h4>
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
					<h4 class="q-pr-md" :style="'color: ' + departure.fgColor">
						{{ getHumanReadableDepartureTime(departure.time) }}
					</h4>
				</div>
			</q-card-section>
		</q-card>
	</template>
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import { ref, onMounted, onUnmounted, computed } from "vue";
	import { useTimeTableStore } from "@/stores/timeTable";

	const timeTableStore = useTimeTableStore();
	const { departureBoard, departures, isLoading } = storeToRefs(useTimeTableStore());
	const intervalId = ref<number | null>(null);
	const currentTime = ref<string>();

	const departuresA = computed(() => {
		return departures.value.filter(d => d.track === "A");
	});
	const departuresB = computed(() => {
		return departures.value.filter(d => d.track === "B");
	});

	const getHumanReadableDepartureTime = (departureTime: string) => {
		const currentDate = new Date();
		const departureDate = new Date();
		departureDate.setHours(parseInt(departureTime.split(":")[0]));
		departureDate.setMinutes(parseInt(departureTime.split(":")[1]));
		const departsInInMS = departureDate.getTime() - currentDate.getTime();
		const departsInInMin = Math.round(departsInInMS / 60_000);
		if (departsInInMin <= 0) return "Is leaving or has left...";
		return `Leaves in ${departsInInMin} minutes`;
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
		const upcomingDepartures = departureBoard!.value!.Departure.filter(d => {
			const departureTime = new Date();
			departureTime.setHours(parseInt(d.time.split(":")[0]));
			departureTime.setMinutes(parseInt(d.time.split(":")[1]));
			return departureTime.getTime() > currentDate.getTime();
		});
		timeTableStore.$patch(state => {
			state.departures = upcomingDepartures;
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
		cleanUpDeparted();
		intervalId.value = window.setInterval(cleanUpDeparted, 1000 * 60);
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
