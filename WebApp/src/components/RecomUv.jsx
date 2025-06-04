import React from 'react';
// import './uvstyles.css';
import chartuv from './image/uv.jpg';
import { Outlet } from "react-router-dom";

const recommendUV = () => {
  


  return (
    <div className='body1'>
      <h1 className='name' style={{ marginTop: '30px', marginBottom: '7px', fontSize: '40px' }}>UV</h1>
      <div className='headtext'>
        <label style={{ fontWeight: 'bold' }}>UV Index หรือ ดัชนีรังสีอัลตราไวโอเลต (UV) หรือนิยามง่ายๆ คือ ความแรงของแดด เป็นการวัดปริมาณของความเข้มของรังสี UV ที่ฉายลงมาบนพื้นผิวโลก</label>
        <br /><label style={{ marginTop: '10px' }}>&nbsp; &bull; &nbsp; ความแรงของแดดในเมืองไทย มีค่าเฉลี่ยอยู่ที่ 11 - 12 ซึ่งอยู่ในระดับความรุนแรงที่สูงมาก</label>
        <br /><label>&nbsp; &bull; &nbsp; แพทย์ผิวหนังแนะนำให้ทาผลิตภัณฑ์กันแดดที่มีค่า SPF ตั้งแต่ 30 ขึ้นไป และมีค่า PA 3+ ขึ้นไป เป็นประจำทุกวันทั้งใบหน้าและผิวกาย เพื่อปกป้องรังสียูวี</label>
      </div>
      <div className='twoside' style={{ marginTop: '30px', marginBottom: '7px'}}>
        <div className='classpic'>
          <br /><label style={{ fontSize: '21px',  fontWeight: 'bold' }}>ระดับความรุนแรงของ UV Index หรือ ความแรงของแดด</label>
          <img src={chartuv} alt="bullet point" style={{ borderRadius: '20px' }} />
        </div>
        <div className='classbox'>
          <div className='box' style={{ backgroundColor: '#9BC700' }}>
            <label style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>Low</label>
            <label style={{ fontSize: '15px', fontWeight: 'bold'}}>0-2.9</label>
            <label style={{ textAlign: 'center', margin: '0' }}>สวมแว่นกันแดดในวันที่ท้องฟ้าโปร่ง</label>
          </div>
          <div className='box' style={{ backgroundColor: '#FEBD01' }}>
            <label style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>Moderate</label>
            <label style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>3-5.9</label>
            <label style={{ fontSize: '15px', margin: '0' }}>ควรปกปิดผิวด้วยเสื้อผ้า หากต้องอยู่กลางแจ้ง ให้หลีกเลี่ยงในช่วงเที่ยงวัน เนื่องจากเป็นช่วงที่มีแสงมากที่สุด</label>
            {/* <label style={{ fontSize: '15px', margin: '0' }}>ให้หลีกเลี่ยงในช่วงเที่ยงวัน เนื่องจากเป็นช่วงที่มีแสงมากที่สุด</label> */}
          </div>
          <div className='box' style={{ backgroundColor: '#F8951D' }}>
            <label style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>High</label>
            <label style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>6-7.9</label>
            <label style={{ fontSize: '15px', margin: '0' }}>ปกปิดผิวด้วยเสื้อผ้า สวมหมวก สวมแว่นกันแดด ใช้ครีมกันแดด ที่มี SPF มากกว่า 30 และ PA มากกว่า 3+ อยู่กลางแจ้งให้น้อยกว่า 3 ชั่วโมง</label> 
            {/* <label style={{ fontSize: '15px', margin: '0' }}>ที่มี SPF มากกว่า 30 และ PA มากกว่า 3+ อยู่กลางแจ้งให้น้อยกว่า 3 ชั่วโมง</label> */}
          </div>
          <div className='box' style={{ backgroundColor: '#EF3E2E' }}>
            <label style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>Very High</label>
            <label style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>8-10.9</label>
            <label style={{ fontSize: '15px', margin: '0' }}>ใช้ครีมกันแดดที่มี SPF มากกว่า 30 และ PA มากกว่า 3+ สวมเสื้อผ้ากันแดด สวมแว่นกันแดด สวมหมวกปีกกว้าง และไม่อยู่กลางแดดเป็นเวลานาน</label>
            {/* <label style={{ fontSize: '15px', margin: '0' }}>สวมแว่นกันแดด สวมหมวกปีกกว้าง และไม่อยู่กลางแดดเป็นเวลานาน</label> */}
          </div>
          <div className='box' style={{ backgroundColor: '#6B408F', height: '130px' }}>
            <label style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>Extreme</label>
            <label style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>11+</label>
            <label style={{ fontSize: '15px', margin: '0' }}>ควรระมัดระวังอย่างมาก โดยใช้ครีมกันแดดที่มี SPF มากกว่า 30 และ PA มากกว่า 3+ สวมเสื้อแขนยาวและกางเกงขายาว สวมแว่นกันแดด สวมหมวกที่สามารถปกปิดได้มิดชิด และหลีกเลี่ยงการอยู่กลางแจ้งนานกว่า 3 ชั่วโมง</label>
            {/* <label style={{ fontSize: '15px', margin: '0' }}>PA มากกว่า 3+ สวมเสื้อแขนยาวและกางเกงขายาว สวมแว่นกันแดด</label>
            <label style={{ fontSize: '15px', margin: '0' }}>สวมหมวกที่สามารถปกปิดได้มิดชิด และหลีกเลี่ยงการอยู่กลางแจ้งนานกว่า 3 ชั่วโมง</label> */}
          </div>
          
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default recommendUV;
