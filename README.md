# BBC-Microbit-V2-Gateway-Development-using-BLE-and-MQTT
Assignment 2 Gateway Development using Bluetooth Low Energy (BLE) and MQTT

Note: This project uses the "BBC-Microbit-V2-Low-Level-Interfacing" repository code and builds upon that project here. 

Task: To develop a system using a gateway communicating with an end device over Bluetooth Low Energy (BLE).

Aims: 
1) To develop a novel BLE central device application
2) Running on raspberry Pi (ubuntu)  that requires the use of BLE services and characteristics configured on a BBC MicroBit BLE peripheral device. 
3) to measure and report environmental variables.


Objectives: 
1)The peripheral device should have a BLE service that provides sensor data (such as  accelerometer values) to the central device gateway and another BLE service (such as a LED) that can be activated via the gateway.
2)The gateway should read the sensor values from the peripheral device, send it to a MQTT broker and then subscribe to the broker for messages to send back to the peripheral to e.g. turn on/off the LED on it.
3)Communication to the cloud broker should use MQTT as a transport.


The delivirables for the project:
1)a design document (describing the components implemented for this assignment and  a flowchart/ UML activity diagram)
2)clearly commented code in a *.js file 




Step 1: refer back and compelete the "BBC-Microbit-V2-Low-Level-Interfacing" repository project. 

Step 2: Download and read the Design Doc. 

Step 3: Run the ble_co2 code first (see steps in "BBC-Microbit-V2-Low-Level-Interfacing" repository project).  

Step 4: Read & run the "gatewayCode" file code. 





