[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/w8H8oomW)  
**<ins>Note</ins>: Students must update this `README.md` file to be an installation manual or a README file for their own CS403 projects.**

**รหัสโครงงาน:** 67-1_29_wdp-r1

**ชื่อโครงงาน (ไทย):** การศึกษาอุปกรณ์บันทึกชีวิตและแพลตฟอร์มสำหรับจัดเก็บข้อมูลเวอร์ชัน 2

**Project Title (Eng):** Towards an Affordable Life Logging Device and Open Data Platform Version 2 

**อาจารย์ที่ปรึกษาโครงงาน:** ผู้ช่วยศาสตราจารย์ ดร.วนิดา พฤทธิวิทยา

**ผู้จัดทำโครงงาน:**
1. นายชญานนท์ ขันฤทธิ์  chayanon.kha@dome.tu.ac.th

Manual / Instructions
# โครงสร้างโฟลเดอร์ย่อย (directory tree)

**ใน Repository นี้มีโครงสร้างของโฟลเดอร์ดังนี้ :**

1. โฟลเดอร์ **final_reports** เป็นโฟลเดอร์รวบรวมเอกสารของโครงงาน ได้แก่
   * 67-2_CS403_67-1_29_wdp-r1.pdf
   * 67-2_CS403_67-1_29_wdp-r1_abstract_en.txt
   * 67-2_CS403_67-1_29_wdp-r1_abstract_th.txt
2. โฟลเดอร์ **[demo]()**  มีวีดีโอแสดงขั้นตอนการติดตั้งและใช้งานโปรแกรม
3. โฟลเดอร์ **[Arduino/reconnectiot](https://github.com/ComSciThammasatU/2567-2-cs403-final-submission-67-1_29_wdp-r1/tree/main/Arduino/reconnectiot)** เป็นโฟลเดอร์ที่บรรจุโค้ดของโปรแกรมสำหรับเบิร์นลงไปยังอุปกรณ์ IoT
4. โฟลเดอร์ **[AndroidApp/FaceRecognitionImages](https://github.com/ComSciThammasatU/2567-2-cs403-final-submission-67-1_29_wdp-r1/tree/main/AndroidApp/FaceRecognitionImages)** เป็นโฟลเดอร์ที่บรรจุโปรแกรม Android application สำหรับใช้งานในโทรศัพท์เคลื่อนที่
5. โฟลเดอร์ **[WebApp](https://github.com/ComSciThammasatU/2567-2-cs403-final-submission-67-1_29_wdp-r1/tree/main/WebApp)** เป็นโฟลเดอร์ที่บรรจุ Web application
6. ไฟล์ **[cloudformationTemplate.yml](https://github.com/ComSciThammasatU/2567-2-cs403-final-submission-67-1_29_wdp-r1/blob/main/cloudformationTemplate.yml)** เป็นไฟล์ yaml สำหรับสร้าง Template ใน Amazon CloudFormation

# ขั้นตอนการติดตั้งโปรแกรม
## จัดเตรียมโปรแกรมที่จำเป็น
1. ติดตั้งโปรแกรม **Arduino IDE เวอร์ชัน 2.0.2** สำหรับเบิร์นโค้ดลงไปยังอุปกรณ์ IoT
2. ติดตั้งโปรแกรม **Android Studio เวอร์ชัน Ladybug | 2024.2.1** สำหรับรันโค้ด Andriod application และใช้งาน Andriod Emulator
3. ติดตั้งโปรแกรม **Visual Studio Code** สำหรับรันโปรแกรม Web application
4. สมัครใช้งานและสร้างบัญชี AWS (Amazon Web Service) สำหรับสร้างเซอร์วิสต่าง ๆ
   * สร้าง Users ในเซอร์วิส Identity and Access Management (IAM)
   * สร้าง Access keys และกำหนด Permission ให้ Users ที่สร้าง จากนั้นบันทึก `accessKeyId` และ `secretAccessKey` ไว้

## ขั้นตอนการติดตั้งโปรแกรมของโครงงาน
 **Clone git repository ไปยังเครื่องที่จะใช้รันโปรแกรม** ด้วยคำสั่ง `git clone`

### **การสร้างเซอร์วิสของ AWS ผ่าน CloudFormation Template**

1. ไปที่หน้าคอนโซลของเซอร์วิส Cloudformation
2. เลือกแถบ Stacks ที่แถบเมนูด้านข้าง
3. เลือก `Create stack` เลือก `With new resources`
4. ใน Prepare template เลือก `Choose an existing template`
5. ใน Specific template เลือก template source เป็น `Upload a template file`
6. อัปโหลดไฟล์ `cloudformationTemplate.yml` และเลือก `Next`
7. ตั้งชื่อ **Stack Name** และตั้ง **Name Prefix** และเลื่อก `Next`
8. ปล่อยทุกอย่างเป็น **Default** และเลือก `Submit`
9. หลังจากนั้นรอจนกว่า Stack จะสร้างเซอร์วิสต่าง ๆ เรียบร้อย
10. เมื่อสร้างสำเร็จแล้ว เลือกไปที่ `Stack details` และเลือก `Outputs`
11. ใน **Key** ชื่อ `APIGatewayURL` มี **Value** เป็น Endpoint ของ ApiGateway อยู่ ให้คัดลอกและบันทึกไว้

### **การติดตั้งโปรแกรมอุปกรณ์ IoT**
  
1. เปิดโฟลเดอร์ **Arduino/reconnectiot** ในโปรแกรม **Arduino IDE**
2. เชื่อมต่อสาย USB สำหรับเบิร์นโค้ดลงอุปกรณ์ แล้วเลือก **Upload** ในโปรแกรม
3. เมื่ออุปกรณ์เริ่มทำงานให้เปิด Serial monitor เพื่อดู Log ที่ได้จากอุปกรณ์ บันทึกเลข IP address ของเซิร์ฟเวอร์ของอุปกรณ์ ที่แสดงใน Serial monitor ไว้

### **การติดตั้ง Android Application**
1. เปิดโฟลเดอร์ **AndroidApp/FaceRecognitionImages** ในโปรแกรม **Android Studio**
2. Build โปรเจคที่นำเข้ามา
3. เปิดไฟล์ในโปรแกรมชื่อ `RecognitionActivity.java`
4. ในบรรทัดที่ 568 `esp32Ip = ""` ให้ใส่ IP ของอุปกรณ์ IoT ที่บันทึกไว้
5. ในบรรทัดที่ 883 `String urlString = "https://gtvy8h0687.execute-api.us-east-1.amazonaws.com/dev/testesp32/" + filename;` ให้แก้ไข `https://gtvy8h0687.execute-api.us-east-1.amazonaws.com/dev/` เป็น **Endpoint** ของ **ApiGateway** ที่บันทึกไว้
6. สร้าง Emulator ตั้งค่าเป็น API 32 ขึ้นไป และ Android 12L ("Sv2") ขึ้นไปและเป็น x86_64 
7. เมื่อสร้างสำเร็จแล้วเลือก `Run app`
8. Emulator จะถูกเปิดขึ้นและโปรแกรมจะถูกเปิดภายใน Emulator

### **การติดตั้ง Web Application**
1. เปิดโฟลเดอร์ **WebApp** ใน **Visual Studio Code**
2. เปิดไฟล์ในโปรแกรมชื่อ `getDataAndSaveToLocal`
3. ในบรรทัดที่ 7 และ 8 ให้เติม `accessKeyId` และ `secretAccessKey` ด้วย acceskey ที่บันทึกไว้ตอนสร้าง Users ในเซอร์วิส IAM ใส่ `region` เป็น region ของ AWS ที่ใช้งานในปัจจุบัน
4. เปิด Terminal ในโปรแกรมและพิมพ์คำสั่ง `npm start`
5. โปรแกรมจะถูกเปิดผ่าน `http://localhost:3000`
6. ทดลองเปลี่ยน path เป็น `http://localhost:3000/Mainpage`
7. ลองใช้งานโปรแกรม

**หลังจากติดตั้งโปรแกรมเรียบร้อยแล้ว ทดลองใช้งานโปรแกรมตาม Pipeline โดยการใช้อุปกรณ์ถ่ายภาพ จากนั้นภาพจะถูกส่งมาประมวลผลที่ Android Application แล้วถูกส่งไปจัดเก็บยังเซอร์วิสบน AWS แล้วลองค้นหารูปภาพผ่าน Web Application**
