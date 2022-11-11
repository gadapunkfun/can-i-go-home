<template>
	<h3 class="q-my-none q-px-md q-pt-md q-pb-none text-white">{{ currentTime }}</h3>
	<div class="row justify-between q-px-md">
		<h3 class="text-positive q-mb-auto">Domkyrkan A</h3>
		<q-icon class="text-h1 text-positive" name="mdi-bus-stop-uncovered" />
	</div>
	<q-card
		class="q-my-xs"
		v-for="(departure, i) in sortedDeparturesA.slice(0, 6)"
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
		v-for="(departure, i) in departureBoardB?.Departure.slice(0, 6)"
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

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import { ref, onMounted, onUnmounted } from "vue";
	import { useTimeTableStore } from "@/stores/timeTable";

	const timeTableStore = useTimeTableStore();
	const { departureBoardA, departureBoardB, sortedDeparturesA, sortedDeparturesB } = storeToRefs(useTimeTableStore());
	const intervalId = ref<number | null>(null);
	const currentTime = ref<string>();

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
		currentTime.value = new Date().toLocaleTimeString();
	}, 1000);

	const cleanDepartureFunc = () => {
		if (departureBoardA && departureBoardA.value) {
			const currentTime = new Date();
			const filtered = departureBoardA.value.Departure.filter(d => {
				const departureTime = new Date();
				departureTime.setHours(parseInt(d.time.split(":")[0]));
				departureTime.setMinutes(parseInt(d.time.split(":")[1]));
				return departureTime.getTime() > currentTime.getTime();
			});
			timeTableStore.$patch(state => {
				state.sortedDeparturesA = filtered;
			});
			console.log(filtered);
		}
	};

	onMounted(async () => {
		await timeTableStore.setSortedDeparturesA();
		await timeTableStore.setSortedDeparturesB();
		intervalId.value = setInterval(cleanDepartureFunc, 5000);
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
