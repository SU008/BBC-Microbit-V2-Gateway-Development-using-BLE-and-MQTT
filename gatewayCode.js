//Name: Sajjad Ullah,
//MQTT broker dashboard available at http://www.hivemq.com/demos/websocket-client/	

//mqtt publishing HEX CO2 AND WAITING FOR MQTT TO ENTER MESSAGE off
//code to send co2 value to the topic, topicToPublishTo & listen for commands from topic, topicToSubscribeTo. 

/*
The environmental variable we will use is the co2 sensor on the SCD30. 
BBC micro bit and using its LED matrix to display a happy emoji face if co2 levels are below a set threshold eg 600 ppm,
if its above the threshold it will display a unhappy emoji face.  
due to no external componemts connected to microbit board eg buzzer, on a message "off" command the LED matrix will turn off. 


When this is working, we can envision e.g. attach a buzzer and turn this on, alerting the occupants of the room to the high co2 levels 
*/
var mqtt = require('mqtt')  //requires the mqtt module saved to mqtt variable 
var mqttClient  = mqtt.connect('mqtt://broker.mqttdashboard.com');
var topicToPublishTo="co2/pub"
var topicToSubscribeTo="co2/sub"



const deviceOfInterest = 'C4:26:87:A4:D6:FA'//device friendly name is C17344483_SU_BLE
const serviceOfInterestUuid_SDC30_primary_service      = '00000001-0002-0003-0004-000000000000'//uuid of co2 service
const characteristicOfInterestUuid_co2_rw      = '00000001-0002-0003-0004-000000000001'    //uuid of read/write characteristic of co2 service
//const characteristicOfInterestUuid_temp     = '00000001-0002-0003-0004-000000000002'    //not used 
//const characteristicOfInterestUuid_humidity = '00000001-0002-0003-0004-000000000003'    //not used 

 






//MQTT events and handlers
mqttClient.on('connect', connectCallback); //when a 'connect' event is received call the connectCallback listener function
        
function connectCallback() {
    console.log("\nconnected to cloud MQTT broker");                                                        //print acknowledgement of connection to console
  mqttClient.subscribe(topicToSubscribeTo, mqttSubscribeCallback);                                          //subscribe to topic "topicToSubscribeTo" defined at top,  call the mqttSubscribeCallback function 
  mqttClient.publish(topicToPublishTo, 'published values from microbit will appear here', publishCallback);//publish intro text to topic "topicToPublishTo" defined at top, call the publishCallback function 
}


function mqttSubscribeCallback(error, granted) { //checking if an error occured when subscribing to topic
   	if (error) {
		console.log("!!!!!!!Error subscribing to topic!!!!!!!");
	} else {	
   	    console.log("\nsubscribed to and awaiting messages on topic '" + topicToSubscribeTo + "'");	//print acknowledgement text with the topic name of where it will appear. this is helpful to user   
    }
}


/*
++++old message event handler++++++
async function messageEventHandler(topic, message, packet) { 
   
    
    console.log("Received message'" + message + "' on topic '" + topic + "'");//print received msg text with the topic name of where it will appear  
    if (message.toString().toLowerCase() == "off") { //cheking if message from broker is an 'off' (not case sensitive)
		
        console.log("\n+++++++++command received from MQTT broker to turn LED off++++++");//print acknowledgement text if msg == 'off' to console
		
        await charact.writeValue(Buffer.from("off")) //write the value "off" to the co2 read write uuid
		

    } else {
		
        console.log("\n++++++++++command received from MQTT broker was not an OFF command+++++++ ");//print this text if msg is anything else to console
		
    }
}
*/


//an async function is a function declared with the async keyword
//enable asynchronous, promise-based behaviour
//this will be used for the messageEventHandler
const messageEventHandler = async (topic, message, packet) => {

   try {
          console.log("\nReceived message'" + message + "' on topic '" + topic + "'");//print received msg text with the topic name of where it will appear 

           if (message.toString().toLowerCase() == "off") { //cheking if message from broker is an 'off' (not case sensitive)
		
	       console.log("\n+++++++++command received from MQTT broker to turn LED off++++++");//print acknowledgement text if msg == 'off' to console
	    
	       await charact.writeValue(new Buffer.from("off")) //write the value "off" to the co2 read write characteristic
	    
            //await charact.write(new Buffer.from("off"), false, writeDataCallback); //(not used)write the value "off" to the co2 read write uuid
		
	       } else {
		
	       console.log("\n++++++++++command received from MQTT broker was not an OFF command+++++++ ");//print this text if msg is anything else to console
		
	      }

      }catch(error) {// Handling rejection here

      console.log("\n\n\n\n\n\nRejcton occured at messageEventHandler")


     }
};

mqttClient.on('message', messageEventHandler); //on a message event call the messageEventHandler function 





function writeDataCallback(error, data) { //function to be called checks if data cannot be written to 
	if (error) {
		console.log("error writing data"); //print text to inform user of the error in console
	} else {	
		//disconnect the central device from the peripheral device
		console.log("--disconnecting---");
		peripheralGlobal.disconnect(disconnectCallback); // disconnect the peripheral
	}
}

//this callback function is called when a message has been published to the broker
function publishCallback(error) {     
   	if (error) {
		console.log("error publishing data");
	} else {	 
   	    console.log("Message is published to topic '" + topicToPublishTo+ "'");//print the topic name of where it will appear. this is helpful to user
        
    }
}



const main = async() => {//the entry point of the application, using async for promises,  asynchronous code

  const {createBluetooth}=require('node-ble') //nodejs ble module/library
  const { bluetooth, destroy } = createBluetooth()

  // get bluetooth adapter
  const adapter = await bluetooth.defaultAdapter() //get an available Bluetooth adapter
  await adapter.startDiscovery()                  //using the adapter, start a device discovery session  
  console.log('discovering')
  
  // look for a specific device 
  const device = await adapter.waitDevice(deviceOfInterest)
  console.log('got device', await device.getAddress())   // await device.getAddress())
  const deviceName = await device.getName()               //get device name
  console.log('got device remote name', deviceName)      //print to console the remote name
  console.log('got device user friendly name', await device.toString())//print to console the user friendly name i.e. device name 

  await adapter.stopDiscovery() //stop discovery mode 

  //connect to the specific device
  await device.connect()
  console.log("connected to device : " + deviceName)
  
  const gattServer = await device.gatt()
  services = await gattServer.services()//getting the gatt services in device 
  console.log("services are " + services)//print the gatt services to console 
  





  while(1){//used to loop indefinitely 

      await new Promise(resolve => setTimeout(resolve, 5000)).catch(); //delay for 5 seconds, to slow down the rate it displays the below code, for readability   

      if (services.includes(serviceOfInterestUuid_SDC30_primary_service)) { //check if the service has the uuid of the service of interest 
		  console.log('\n---------------------------------------------------------------')
		  console.log('\nGot the co2, temp , humidity  service')

		  //Primary Service: represents the primary functionality of a device.
		  const primaryNotifyService = await gattServer.getPrimaryService(serviceOfInterestUuid_SDC30_primary_service)//getting the Primary Service 
		  charact = await primaryNotifyService.getCharacteristic(characteristicOfInterestUuid_co2_rw)//save primaryNotifyService as 'charact' 
          console.log("characteristic flags are : " + await charact.getFlags())//Print the flags of the uuid 

		  cval = await charact.readValue()//saving co2 value to co2-value ( cval for short ) 
		  
          
		  console.log('\nPublishing to mqtt')	  
		  mqttClient.publish(topicToPublishTo,"co2 val hex:"+ cval.toString('hex'), publishCallback);//publish to 'topicToPublishTo' (defined at top) with cval in hex, call the publishCallback function 
		  console.log('\nDone Publishing to mqtt')
		  
		  console.log('\n---------------------------------------------------------------')	  
		   
	  }
  }

  await device.disconnect()
  console.log('disconnected')
  process.exit()
}


main()
  .then()
  .catch(console.error)
  
