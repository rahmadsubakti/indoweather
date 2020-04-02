import React from 'react';

const berawan = require('../asset/berawan-300px.svg');
const cerah = require('../asset/cerah-300px.svg');
const cerahBerawan = require('../asset/cerah-berawan-300px.svg');
const hujan = require('../asset/hujan-300px.svg');
const hujanLebat = require('../asset/hujan-lebat-300px.svg');
const hujanRingan = require('../asset/hujan-ringan-300px.svg');
const kabut = require('../asset/kabut-300px.svg');
const mendung = require('../asset/mendung-300px.svg');
const petir = require('../asset/petir-300px.svg');

const weatherCode = {
	0 : {text:'Cerah', alt: 'cerah-300px.svg', file: cerah},
	100 : {text:'Cerah', alt: 'cerah-300px.svg', file: cerah},
	1 : {text:'Cerah Berawan', alt: 'cerah-berawan-300px.svg', file: cerahBerawan},
	101: {text:'Cerah Berawan', alt:'cerah-berawan-300px.svg', file: cerahBerawan},
	2 : {text:'Cerah Berawan', alt:'cerah-berawan-300px.svg', file: cerahBerawan},
	102 : {text:'Cerah Berawan', alt:'cerah-berawan-300px.svg', file: cerahBerawan},
	3 : {text:'Berawan', alt: 'berawan-300px.svg', file: berawan},
	103 : {text:'Berawan', alt: 'berawan-300px.svg', file: berawan},
	4 : {text: 'Berawan Tebal', alt:'mendung-300px.svg', file: mendung},
	104 : {text: 'Berawan Tebal', alt:'mendung-300px.svg', file: mendung},
	5 : {text:'Udara Kabur', alt: 'kabut-300px.svg', file: kabut},
	10 : {text:'Asap', alt: 'kabut-300px.svg', file: kabut},
	45 : {text: 'Kabut', alt: 'kabut-300px.svg', file: kabut},
	60 : {text:'Hujan Ringan', alt:'hujan-ringan-300px.svg', file: hujanRingan},
	61 : {text: 'Hujan Sedang', alt: 'hujan-300px.svg', file: hujan},
	63 :{text:'Hujan Lebat', alt: 'hujan-lebat-300px.svg', file: hujanLebat},
	80 : {text:'Hujan Lokal', alt: 'hujan-300px.svg', file: hujan},
	95 : {text:'Hujan Petir', alt: 'petir-300px.svg', file: petir},
 	97 : {text:'Hujan Petir', alt: 'petir-300px.svg', file: petir},
}

function range(start, end) {
	/**
	 *Generate array of all integers from start to end
	*/
	let arr = [];
	for (let i = start; i < end; i++) {
		arr.push(i)
	}
	return arr

}

function createTime(time) {
	if (time < 12) {
		return `0${time}:00`;
	}
	return `${time%24}:00`;
}

function parseDate(date) {
	const year = date.slice(0,4);
	const month = date.slice(4,6);
	const day = date.slice(6,8);
	return {year: year, month: month, day: day};
}

function nameDate(date) {
	let day = `${date.month}/${date.day}/${date.year}`
	day = new Date(day);
	return day.toLocaleDateString('id-ID', {weekday: 'long'});
}

function TimeRange(props) {
	const text = weatherCode[props.weather].text;
	const img_name = weatherCode[props.weather].alt;
	const img = weatherCode[props.weather].file

	return (
		<div className="card">
			<h3>{createTime(props.hour)}</h3>
			<div className="image">
				<img src={img} alt={img_name} className="weather-img" />
			</div>
			<p>{text}</p>
			<p className="temperature">{props.temperature}&deg;C</p>
		</div>
	)
}

function TimeCard(props) {
	let val = props.value;
	let weather = props.weather.timerange[val];
	let temperature = props.temperature.timerange[val];
							
	return <TimeRange hour={weather.$.h} 
			weather={weather.value[0]._}
			temperature={temperature.value[0]._} 
		/>
}


export function Listweather(props) {
	if (props.weather.length > 0) {
		const today = parseDate(props.weather[6].timerange[0].$.datetime);
		const tomorrow = parseDate(props.weather[6].timerange[4].$.datetime);
		const dayAfterTomorrow = parseDate(props.weather[6].timerange[8].$.datetime);
		
		let todayName = nameDate(today);
		let tomorrowName = nameDate(tomorrow);
		let dayAfterTomorrowName = nameDate(dayAfterTomorrow);

		return (
			<div className="weather-info">
				<div className="weather-container">
					<h2>{todayName} - {today.day}/{today.month}/{today.year}</h2>
					<div className="card-list">
						{range(0,4).map(val => 
							<TimeCard
								key={'card' + val} 
								weather={props.weather[6]} 
								temperature={props.weather[5]} 
								value={val} 
							/>
						)}
					</div>
				</div>
				<div className="weather-container">
					<h2>{tomorrowName} - {tomorrow.day}/{tomorrow.month}/{tomorrow.year}</h2>
					<div className="card-list">
						{range(4,8).map(val => 
							<TimeCard
								key={'card' + val} 
								weather={props.weather[6]} 
								temperature={props.weather[5]} 
								value={val} 
							/>
						)}
					</div>
				</div>
				<div className="weather-container">
					<h2>{dayAfterTomorrowName} - {dayAfterTomorrow.day}/{dayAfterTomorrow.month}/{dayAfterTomorrow.year}</h2>
					<div className="card-list">
						{range(8,12).map(val => 
							<TimeCard 
								key={'card' + val}
								weather={props.weather[6]} 
								temperature={props.weather[5]} 
								value={val} 
							/>
						)}
					</div>
				</div>
			</div>
		)
	}
	return (
		<div className="weather-info">
			<div className="weather-container">
				<p className="warning">Pilih Provinsi dan Daerah terlebih dahulu</p>
			</div>
			<div className="weather-container">
				<p className="warning">Pilih Provinsi dan Daerah terlebih dahulu</p>
			</div>
			<div className="weather-container">
				<p className="warning">Pilih Provinsi dan Daerah terlebih dahulu</p>
			</div>
		</div>
	);
}