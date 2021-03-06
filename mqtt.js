require('dotenv').config();
var mqtt = require('mqtt');
var FormData = require('form-data');


console.log(process.env.MQTTNAME);
var client = mqtt.connect(process.env.MQTT_BROKER,{
    username: process.env.MQTTNAME,
        password: process.env.PASSWORD
});

client.on('connect', function() {
    client.subscribe('#');
    // client.publish('presence', 'Hello mqtt')
});
function reverse(s) {
    var o = '';
    for (var i = s.length - 1; i >= 0; i--)
        o += s[i];
    return o;
};
client.on('message', function(topic, message) {
    // message is Buffer

    // console.log(message.toString());
    var data = message.toString();
    var dataobj = JSON.parse(data);
    // console.log(dataobj[0].data+"+"+dataobj[0].gwip);

    const form = new FormData();
    // form.append('data', dataobj[0].data);
    // form.append('gwip', dataobj[0].gwip);
    // var macisnum;
    // if(dataobj[0].macAddr)
    // {
    //     macisnum = /^\d+$/.test(dataobj[0].macAddr);
    // }
    // typeof dataobj[0].macAddr !== 'undefined'&&dataobj[0].macAddr.substr(8,6)=='123456'&&macisnum&&typeof dataobj[0].data !== 'undefined'
    if (typeof dataobj[0].macAddr !== 'undefined'&&dataobj[0].macAddr.substr(8,2)=='aa'&&typeof dataobj[0].data !== 'undefined')
    {

            // console.log(dataobj[0].data.substr(4,6));
            var macaddr=dataobj[0].macAddr.substr(8);
            if(dataobj[0].data.substr(2,2)=="88") //GPS DATA
            {
                console.log("gps");
                var lat =0.0001*parseInt(dataobj[0].data.substr(4,6),16);
                var lng= 0.0001*parseInt(dataobj[0].data.substr(10,6),16);

                form.append('macaddr', macaddr);
                form.append('lat', lat.toFixed(4));
                form.append('lng', lng.toFixed(4));
                // var lat=0.0000001*parseInt('0x'+reverse(dataobj[0].data.substr(0,8)));
                // var lng=0.0000001*parseInt('0x'+reverse(dataobj[0].data.substr(8,8)));
                // console.log(macaddr);
                console.log(lat.toFixed(4));
                console.log(lng.toFixed(4));
                // console.log(process.env.DB_URI);
            }
            else //Vibration Data
            {
                console.log("vibration");
                var data= dataobj[0].data;
                data=parseInt(data,16);
                form.append('macaddr', macaddr);
                form.append('data', parseInt(dataobj[0].data.substr(0,4),16));
                console.log(macaddr);
                console.log(data);
            }

            form.submit(process.env.DB_URI, function(err, res) {
                // res – response object (http.IncomingMessage)  //
                res.resume();
                // console.log(res);
            });

    }
});
//remote repo
//git remote show origin
//git clone <url> --branch <branch>
