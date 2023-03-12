let express = require('express');
let cors = require('cors')
let config = require('./config');
let fs = require('fs');
let server = express();

server.use(cors());

const PORT = config.app.PORT || 8080;
const intervals = config.cnc.chartIntervals || 30;
const fetchRate = config.cnc.fetchRate || 5000;

let temperature;
let temperatures = [];
let sensorTemperatures = [];

server.get('/temperature', (req, res) => {
   getTemperature();
   res.json({temperatures, sensorTemperatures});
});

server.get('/config', (req, res) => {
   res.json(config.cnc);
});

server.listen(PORT, () => {
   console.log(`server running on port ${PORT}`);
   config.sensors.forEach(s => {
	  sensorTemperatures.push({name: s.name, data: []})
   })
});

function getTemperature() {
  sensorTemperatures.forEach(s => {
	  temperature = Math.floor(Math.random() * 100);
	  s.data.forEach(t => {
		  t.id = t.id -1;
	  });
	   s.data.push({id: intervals, temp: temperature})
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
