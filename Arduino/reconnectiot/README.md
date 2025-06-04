
# ALL-D
พัฒนาอุปกรณ์ สำหรับการบันทึกชีวิตโดยเก็บข้อมูลได้หลากหลายได้แก่
- รูปภาพ
- อุณหภูมิ
- ความชื้น
- ความเข้มแสงUV
- ตำแหน่งLatitude,Longtitude
## อุปกรณ์ที่ใช้
- ESP32-Cam
เป็นModuleหลักที่ใช้ชิพ ESP32-S ในการประมวลผลและมาพร้อมกับกล้องสำหรับเก็บภาพถ่าย
- SHT21
เป็นเซนเซอร์สำหรับการเก็บอุณหภูมิและความชื้น
- Grove-Sunlight sensor
เป็นเซนเซอร์ที่ใช้ในการอ่านความเข้มแสงUV
- Ublox NEO-6M
เป็นModuleที่ใช้สำหรับการอ่านค่าLatitude,Longtitude
- TP4056 1A USB-C Charger
สำหรับการชาจแบตเตอรี่ให้กับอุปกรณ์
- 3.7v 5000mah 115570 Li-Po li ion 
แบตเตอรี่สำหรับการให้พลังงานอุปกรณ์
## การเชื่อมต่ออุปกรณ์เซนเซอร์เข้ากับesp32-Cam
- SHT21 
  - VIN -> 3V3
  - GND -> GND
  - SCL -> IO15
  - SDA -> IO14
- Grove-Sunlight sensor
  - SCL -> IO15
  - SDA -> IO14   
  - VIN -> 3V3
  - GND -> GND
- Ublox NEO-6M
  - VCC -> 3V3
  - RX -> IO13   
  - TX -> IO12 
  - GND -> GND
- TP4056 1A USB-C Charger
  - B+ -> สายจ่ายไฟของแบตเตอรี่
  - B- -> สายGNDของแบตเตอรี่   
  - OUT+ -> 3v3 
  - OUT- -> GND

