let express = require('express');
let cors = require('cors')
let config = require('./config');
let fs = require('fs');
let sensor = require('ds18x20');
let server = express();

server.use(cors());

const PORT = config.app.PORT || 8080;
const intervals = config.cnc.chartIntervals || 30;

let temperature;
let temperatures = [];
let sensorTemperatures = [];

sensor.loadDriver(function (err) {
   if (err) console.log('something went wrong loading the driver:', err)
   else console.log('driver is loaded');
});

let listOfSensorIds = sensor.list();

server.get('/temperature', (req, res) => {
   getTemperature();
   res.json({temperatures, sensorTemperatures});
});

server.get('/config', (req, res) => {
   res.json(config.cnc);
});

server.listen(PORT, () => {
   console.log(`server running on port ${PORT}`);
   listOfSensorIds.forEach(s => {
     let name = s.id;
     let override = config.sensors.filter(c => c.id === s);
     if(override !== undefined && override.name !== undefined && override.name !== null) {
      name = override.name;
     }
	  sensorTemperatures.push({name: s.name, id:s.id, data: []})
   })
});

function getTemperature() {
  sensorTemperatures.forEach(s => {
	  
	  s.data.forEach(t => {
		  t.id = t.id -1;
	  });
	   s.data.push({id: intervals, temp: sensor.get(s.id)})
	   if(s.data.length >= intervals + 1) {
			s.data.shift();
		}
   })
  temperature = Math.floor(Math.random() * 100);
  temperatures.forEach(t => {
	  t.id = t.id -1;
  });
  temperatures.push({id: intervals, temp: temperature});
  if(temperatures.length >= intervals + 1) {
	  temperatures.shift();
  }
}
