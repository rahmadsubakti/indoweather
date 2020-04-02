import React from 'react';
import logo from './logo.svg';
import { Select } from './fetch-xml'
import { Listweather } from './component/weatherShow'
const parser = require('xml2js').parseString;
//import './App.css';

const provinceList = [
    {'name': 'Aceh', 'value': 'Aceh'},
    {'name': 'Bali', 'value': 'Bali'},
    {'name': 'BangkaBelitung', 'value': 'Bangka Belitung'},
    {'name': 'Banten', 'value': 'Banten'},
    {'name': 'Bengkulu', 'value': 'Bengkulu'},
    {'name': 'DIYogyakarta', 'value': 'DI Yogyakarta'},
    {'name': 'DKIJakarta', 'value': 'DKI Jakarta'},
    {'name': 'Gorontalo', 'value': 'Gorontalo'},
    {'name': 'Jambi', 'value': 'Jambi'},
    {'name': 'JawaBarat', 'value': 'Jawa Barat'},
    {'name': 'JawaTengah', 'value': 'Jawa Tengah'},
    {'name': 'JawaTimur', 'value': 'Jawa Timur'},
    {'name': 'KalimantanBarat', 'value': 'Kalimantan Barat'},
    {'name': 'KalimantanSelatan', 'value': 'Kalimantan Selatan'},
    {'name': 'KalimantanTengah', 'value': 'Kalimantan Tengah'},
    {'name': 'KalimantanTimur', 'value': 'Kalimantan Timur'},
    {'name': 'KalimantanUtara', 'value': 'Kalimantan Utara'},
    {'name': 'KepulauanRiau', 'value': 'Kepulauan Riau'},
    {'name': 'Lampung', 'value': 'Lampung'},
    {'name': 'Maluku', 'value': 'Maluku'},
    {'name': 'MalukuUtara', 'value': 'Maluku Utara'},
    {'name': 'NusaTenggaraBarat', 'value': 'Nusa Tenggara Barat'},
    {'name': 'NusaTenggaraTimur', 'value': 'Nusa Tenggara Timur'},
    {'name': 'Papua', 'value': 'Papua'},
    {'name': 'PapuaBarat', 'value': 'Papua Barat'},
    {'name': 'Riau', 'value': 'Riau'},
    {'name': 'SulawesiBarat', 'value': 'Sulawesi Barat'},
    {'name': 'SulawesiSelatan', 'value': 'Sulawesi Selatan'},
    {'name': 'SulawesiTengah', 'value': 'Sulawesi Tengah'},
    {'name': 'SulawesiTenggara', 'value': 'Sulawesi Tenggara'},
    {'name': 'SulawesiUtara', 'value': 'Sulawesi Utara'},
    {'name': 'SumateraBarat', 'value': 'Sumatera Barat'},
    {'name': 'SumateraSelatan', 'value': 'Sumatera Selatan'},
    {'name': 'SumateraUtara', 'value': 'Sumatera Utara'}
]

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentProvince: '',
      isLoading:false,
      timeXML: '',
      data: [],
      currentAreaName: '',
      currentAreaData: []
    }
    this.changeProvince = this.changeProvince.bind(this);
    this.fetchXML = this.fetchXML.bind(this);
    this.changeArea = this.changeArea.bind(this);
  }

  fetchXML() {
    const province = this.state.currentProvince;
    if (province !== '') {
      this.setState({isLoading: true});
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
          }).map(function(area) {
          return {region: area.name[0]._, area: area.name[1]._, parameter: area.parameter}
          });
          const time = `tanggal ${day} ${month} ${year} pukul ${hour}:${minute}:${second}`;
    
          return {areas:areas, time:time};
        })
        .then(jsonObj => this.setState({data:jsonObj.areas, 
                      isLoading: false, 
                      timeXML: jsonObj.time,
                      currentAreaName: '',
                      currentAreaData: []}))
    }
  }

  changeProvince(event) {
    this.setState({currentProvince: event.target.value})
  }

  changeArea(event) {
    let currentAreaData;
    this.state.data.forEach(function(Obj) {
      if (Obj.region === event.target.value) {
        currentAreaData = Obj.parameter;
      }
    });
    this.setState({currentAreaName: event.target.value, currentAreaData: currentAreaData});
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate');
    if (prevState.currentProvince !== this.state.currentProvince) {
      this.fetchXML();
    }
  }

  render() {
    let areas = this.state.data.map(function(val) {return {name: val.region, value: val.region} })
    let currentAreaData = this.state.currentAreaData;

    return (
        <div>
          <Select 
            optionList={provinceList} 
            defaultValue={this.state.currentProvince === ''}
            defaultText={'Pilih Provinsi'}
            onChange={this.changeProvince} 
          />
          <Select
            optionList={areas}
            defaultValue={this.state.currentAreaName === ''}
            defaultText={'Pilih Daerah'}
            onChange={this.changeArea}
          />
          {this.state.isLoading && <span className="loading">Memuat...</span>}
          <div className="weather">
              <Listweather weather={currentAreaData} />
          </div>
        </div>
      )
  }
}