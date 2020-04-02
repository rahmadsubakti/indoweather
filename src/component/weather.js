import React from 'react';
import { Listweather} from './weatherShow';
const parser = require('xml2js').parseString;

/**/

export class Weather extends React.PureComponent {
	constructor(props){
		super(props);
		this.state = {
						timeXML: '', 
						data: [], 
						isLoaded: false, 
						currentAreaName: '', 
						currentAreaData: [],
					};
		this.handleChange = this.handleChange.bind(this);
		this.fetchXML = this.fetchXML.bind(this);
	}
	
	componentDidMount() {
	    if (this.props.province) {
	        this.fetchXML();
	    }
	}

	fetchXML() {
	    const province = this.props.province;
		fetch(`http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-${province}.xml`)
			.then(res => res.text())
			.then(function(xmlData) {
				let jsonObj;
				parser(xmlData, (error, result) => jsonObj = result);
				return jsonObj;
			})
			.then(function(jsonObj) {
				const {year, month, day, hour, minute, second} = jsonObj.data.forecast[0].issue[0];
				let areas = jsonObj.data.forecast[0].area;
				areas = areas.filter(function(area) {
						return area.parameter;
						//return {region: area.name[0]._, area: area.name[1]._, parameter: area.parameter}
					}
				).map(function(area) {
					return {region: area.name[0]._, area: area.name[1]._, parameter: area.parameter}
				});
				const time = `tanggal ${day} ${month} ${year} pukul ${hour}:${minute}:${second}`;
		
				return {areas:areas, time:time};
			})
			.then(jsonObj => this.setState({data:jsonObj.areas, 
											isLoaded: true, 
											timeXML: jsonObj.time,
											currentAreaName: '',
											currentAreaData: []}))
	}
	

	componentDidUpdate(prevProps, prevState) {
	    console.log('componentDidUpdate')
	    if (prevProps.province !== this.props.province) {
	    	this.fetchXML();
	    }
	}

	handleChange(event) {
		let currentAreaData;
		console.log('handleChange called')
		this.state.data.forEach(function(Obj) {
			if (Obj.region === event.target.value) {
				currentAreaData = Obj.parameter;
			}
		})
		this.setState({currentAreaName: event.target.value, currentAreaData: currentAreaData});
	}

	render() {
		let areas = this.state.data;
		let currentRegion = '';
		let currentAreaData = this.state.currentAreaData;
		if (this.state.isLoaded) {
			const time = this.state.timeXML;
			//areas = this.state.data;
			currentRegion = this.state.currentAreaName;	
		}

		return (
				<React.Fragment>
					<div className="dropdown">
				   		<select value={currentRegion} onChange={this.handleChange}>
				    		{!currentRegion ? 
				    			<option defaultValue={''}>Pilih daerah</option>
				    			: null
				    		}
				    		{areas.map(area => <option key={area.region} value={area.region}>{area.region}</option>)}
				    	</select>
				    </div>
				    <div className="weather">
				    	{currentAreaData.length > 0 ? <Listweather weather={currentAreaData} /> : null}
				    </div>
				</React.Fragment>
		)
       
	}
}