import { createRouter, createWebHistory } from "vue-router";
import TimeTable from "@/components/TimeTable.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "TimeTable",
			component: TimeTable
		}
	]
});

export default router;
