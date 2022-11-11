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
