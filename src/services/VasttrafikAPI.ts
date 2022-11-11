import { BaseService } from "./BaseService";

const BASE_URL = "https://api.vasttrafik.se/bin/rest.exe/v2";

export interface DepartureBoard {
	noNamespaceSchemaLocation: string;
	servertime: string;
	serverdate: string;
	Departure: Departure[];
}

export interface Departure {
	name: string;
	sname: string;
	accessibility?: string;
	journeyNumber: string;
	type: string;
	stopid: string;
	stop: string;
	time: string;
	date: string;
	journeyid: string;
	direction: string;
	track: string;
	fgColor: string;
	bgColor: string;
	stroke: string;
	journeyDetailRef: {
		ref: string;
	};
}

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
