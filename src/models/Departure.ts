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

const formatDepartureTime = (time: string) => {
	const currentDate = new Date();
	const departureDate = new Date();
	departureDate.setHours(parseInt(time.split(":")[0]));
	departureDate.setMinutes(parseInt(time.split(":")[1]));
	const departsInInMS = departureDate.getTime() - currentDate.getTime();
	const departsInInMin = Math.round(departsInInMS / 60_000);
	return departsInInMin;
};

export class DeparturesWithGroupedDepartureTime implements Departure {
	name: string;
	sname: string;
	accessibility?: string | undefined;
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
	rtDate?: string | undefined;
	rtTime?: string | undefined;
	JourneyDetailRef: { ref: string };
	departureTimes: string[];
	get departureTimesFormatted(): number[] {
		return this.departureTimes.map(t => formatDepartureTime(t));
	}
	constructor(departure: Departure) {
		this.name = departure.name;
		this.sname = departure.sname;
		this.accessibility = departure.accessibility;
		this.journeyNumber = departure.journeyNumber;
		this.type = departure.type;
		this.stopid = departure.stopid;
		this.stop = departure.stop;
		this.time = departure.time;
		this.date = departure.date;
		this.journeyid = departure.journeyid;
		this.direction = departure.direction;
		this.track = departure.track;
		this.fgColor = departure.fgColor;
		this.bgColor = departure.bgColor;
		this.stroke = departure.stroke;
		this.rtDate = departure.rtDate;
		this.rtTime = departure.rtTime;
		this.JourneyDetailRef = departure.JourneyDetailRef;
		this.departureTimes = new Array<string>();
		this.departureTimes.push(departure.time);
	}
}
