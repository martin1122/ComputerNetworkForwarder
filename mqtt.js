require('dotenv').config();
var mqtt = require('mqtt');
var FormData = require('form-data');



var client  = mqtt.connect(process.env.MQTT_BROKER);

client.on('connect', function () {
    client.subscribe('#');
    // client.publish('presence', 'Hello mqtt')
})

client.on('message', function (topic, message) {
    // message is Buffer

    // console.log(message.toString());
    var data= message.toString();
    var dataobj= JSON.parse(data);
    // console.log(dataobj[0].data+"+"+dataobj[0].gwip);

    const form = new FormData();
    form.append('data', dataobj[0].data);
    form.append('gwip', dataobj[0].gwip);
    form.append('macAddr', dataobj[0].macAddr);

    form.submit(process.env.DB_URI, function(err, res) {
        // res – response object (http.IncomingMessage)  //
        res.resume();
    });


});