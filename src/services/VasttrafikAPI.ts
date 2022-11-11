import { BaseService } from "./BaseService";
import type { DepartureBoard } from "@/models/DepartureBoard";

const BASE_URL = "https://api.vasttrafik.se/bin/rest.exe/v2";

export async function GetDomkyrkanDepartures() {
	// "9022014002130001" Domkyrkan, Gothenburg A
	// "9022014002130002" Domkyrkan, Gothenburg B
	return await GetDepartureFromStop("9022014002130001");
}

function GetDepartureFromStop(stopId: string) {
	const currentDate = new Date().toLocaleDateString("sv-SE", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	});
	const currentTime = new Date().toLocaleTimeString("sv-SE", {
		hour: "2-digit",
		minute: "2-digit"
	});
	const baseService = new BaseService(
		BASE_URL,
		"departureBoard" + "?id=" + stopId + "&date=" + currentDate + "&time=" + currentTime + "&format=json"
	);
	return baseService.Get<{ DepartureBoard: DepartureBoard }>();
}
