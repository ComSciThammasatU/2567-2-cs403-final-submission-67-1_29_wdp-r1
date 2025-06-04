import React from 'react';
// import './temp.css';
import human from './image/37half.png'; 
import { Outlet } from "react-router-dom";

const recommendTemp = () => {
  


  return (
    <div className='body1'>
      <h1 className='name' style={{ marginTop: '30px', marginBottom: '7px', fontSize: '40px' }}>Temperature</h1>
      <div className='headtext'>
        <label>อุณหภูมิของอากาศเป็นปัจจัยที่สำคัญที่มีผลต่อสุขภาพเนื่องจากอุณหภูมิของอากาศบริเวณโดยรอบร่างกายจะสร้างผลกระทบต่ออุณหภูมิร่างกาย
        <br />ทั้งภายในและภายนอกโดยปกติอุณหภูมิภายในร่างกายจะมีค่าค่อนข้างคงที่และแตกต่างกันไม่มากนักในแต่ละบุคคล
        </label>
        <div className='cen'>
          <label style={{ backgroundColor:  '#f8e6bd', fontWeight: 'bold'}} >โดยทั่วไปอุณหภูมิค่าเฉลี่ยภายในร่างกายมนุษย์จะมีค่าประมาณ 37 องศาเซลเซียส</label>
          <br /><label style={{ marginTop: '10px', alignItems: 'center' }}>&nbsp; &bull; &nbsp; ความชื้นสัมพันธ์ที่มนุษย์รู้สึกสบายมีค่าเฉลี่ยอยู่ระหว่าง 40 % RH – 60 % RH เมื่ออยู่ในอุณหภูมิที่ 18-25 องศาเซลเซียส</label>
        </div>
      </div>
      <div className='threeside' style={{ marginTop: '30px', marginBottom: '7px'}}>
      <div className='classbox'>
          <div className='box'>
            <label style={{ fontSize: '18px', fontWeight: 'bold'}}>อุณหภูมิ</label>
          </div>
          <div className='box' style={{ backgroundColor: '#5B97F4' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>มนุษย์จะรู้สึกไม่สบายตัว</label>
            <label style={{ fontSize: '15px', margin: '0' }}>เมื่ออุณหภูมิที่ต่ำกว่า 18 องศาเซลเซียส ควรใส่เสื้อผ้าที่รักษาความอบอุ่นให้กับร่างกาย</label>
            {/* <label style={{ fontSize: '15px', margin: '0' }}>ให้หลีกเลี่ยงในช่วงเที่ยงวัน เนื่องจากเป็นช่วงที่มีแสงมากที่สุด</label> */}
          </div>
          {/* <div className='box' style={{ backgroundColor: '#5B97F4' }}>
            <label style={{ fontSize: '15px', margin: '0' }}> ใส่เสื้อผ้าที่รักษาความอบอุ่นให้กับร่างกาย</label>
          </div> */}
          <div className='box' style={{ backgroundColor: '#9BC700' }}>
            {/* <label style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>Low</label> */}
            <label style={{ fontSize: '15px', fontWeight: 'bold'}}>จะสบายตัวเมื่ออยู่ในอุณหภูมิ</label>
            <label style={{ textAlign: 'center', margin: '0',fontSize: '15px' }}>ที่ 18-25 องศาเซลเซียส</label>
          </div>
          <div className='box' style={{ backgroundColor: '#F8951D' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>ถ้าอุณหภูมิสูงขึ้นที่ 25 องศาเซลเซียส</label>
            <label style={{ fontSize: '15px', margin: '0' }}> การเผชิญกับอุณหภูมิสูงอาจทำให้รู้สึกร้อนและไม่สบาย โดยเฉพาะในสถานที่ที่มีความชื้นสูง อุณหภูมิสูงอาจทำให้ร่างกายมีความเสี่ยงต่อการเจ็บป่วย
            และอาจทำให้ระบบหัวใจและหลอดเลือดทำงานหนักขึ้น ทำให้เพิ่มความเสี่ยงต่อโรคหัวใจและหลอดเลือด</label> 
            {/* <label style={{ fontSize: '15px', margin: '0' }}>ที่มี SPF มากกว่า 30 และ PA มากกว่า 3+ อยู่กลางแจ้งให้น้อยกว่า 3 ชั่วโมง</label> */}
          </div>
          <div className='box' style={{ backgroundColor: '#EF3E2E' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>การเผชิญกับอุณหภูมิสูง (เกิน 40°C) เป็นเวลานาน</label>
            <label style={{ fontSize: '15px', margin: '0' }}> สามารถทำให้ร่างกายขาดน้ำและเสียความชื้นได้ง่ายขึ้น
             อุณหภูมิสูงอาจทำให้ร่างกายไม่สามารถระบายความร้อนได้เพียงพอ ทำให้เกิดอาการร้อนในร่างกายและเกิดความเสี่ยงต่อการช็อคความร้อน (heat stroke)</label> 
            {/* <label style={{ fontSize: '15px', margin: '0' }}>ที่มี SPF มากกว่า 30 และ PA มากกว่า 3+ อยู่กลางแจ้งให้น้อยกว่า 3 ชั่วโมง</label> */}
          </div>
          
          
        </div>
        <div className='classpic'>
          <br /><label style={{ fontSize: '21px',  fontWeight: 'bold' }}>อุณหภูมิค่าเฉลี่ยภายในร่างกายมนุษย์</label>
          <img src={human} alt="bullet point" style={{ borderRadius: '20px' }} />
        </div> 
        <div className='classbox'>
        <div className='box'>
            <label style={{ fontSize: '18px', fontWeight: 'bold'}}>ความชื้น</label>
          </div>
          <div className='box' style={{ backgroundColor: '#5B97F4' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>อากาศจะเย็นลง และหนาว</label>
            <label style={{ fontSize: '15px', margin: '0' }}>เมื่อความชื้นสัมพันธ์มีค่ามากกว่า 60 % RH เพราะความชื้นที่มากขึ้นจะทำให้ อากาศในห้องเกิดไอน้ำมีความชื้นสะสม ก่อให้เกิด เชื้อรา และแบตทีเรีย อาจเกิดปัญหาทางสุขภาพได้ 
            ควรลดความชื้นในอากาศโดยเครื่องลดความชื้น</label>
            {/* <label style={{ fontSize: '15px', margin: '0' }}>ให้หลีกเลี่ยงในช่วงเที่ยงวัน เนื่องจากเป็นช่วงที่มีแสงมากที่สุด</label> */}
          </div>
          <div className='box' style={{ backgroundColor: '#9BC700' }}>
            {/* <label style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>Low</label> */}
            <label style={{ fontSize: '15px', fontWeight: 'bold'}}>ความชื้นสัมพันธ์ที่มนุษย์รู้สึกสบาย</label>
            <label style={{ textAlign: 'center', margin: '0',fontSize: '15px' }}>มีค่าเฉลี่ยอยู่ระหว่าง 40 % RH – 60 % RH</label>
          </div>
          <div className='box' style={{ backgroundColor: '#F8951D' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>จะเริ่มไม่สบายตัวที่ความชื้นสัมพันธ์ที่ต่ำกว่า 40 % RH </label>
            <label style={{ fontSize: '15px', margin: '0' }}>อากาศที่แห้งเกินไป มนุษย์เราจะเริ่มรู้สึกหายใจไม่สะดวก อึดอัดและจมูกแห้ง</label> 
            {/* <label style={{ fontSize: '15px', margin: '0' }}>ที่มี SPF มากกว่า 30 และ PA มากกว่า 3+ อยู่กลางแจ้งให้น้อยกว่า 3 ชั่วโมง</label> */}
          </div>
          <div className='box' style={{ backgroundColor: '#EF3E2E' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>และความชื้นสูงมากกว่า 75% RH</label>
            <label style={{ fontSize: '15px', margin: '0' }}> สามารถทำให้ร่างกายขาดน้ำและเสียความชื้นได้ง่ายขึ้น อาจทำให้เกิดอาการช็อกได้ เนื่องจากการสูญเสียน้ำและเกลือร่วมกับการกักเก็บความร้อนในร่างกาย</label> 
            {/* <label style={{ fontSize: '15px', margin: '0' }}>ที่มี SPF มากกว่า 30 และ PA มากกว่า 3+ อยู่กลางแจ้งให้น้อยกว่า 3 ชั่วโมง</label> */}
          </div>
          
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default recommendTemp;