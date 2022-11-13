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
	rtDate?: string;
	rtTime?: string;
	JourneyDetailRef: {
		ref: string;
	};
}

export interface DepartureGroupedDepartureTime extends Departure {
	departureTimes: string[];
}
