import React, { useEffect, useState } from "react";
import FetchAllAndSaveButton from "./getDataAndSaveToLocal";
import ClearLocalStorageButton from "./ClearLocalStorageButton";
import MapDisplay from "./MapDisplay";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaTemperatureHigh } from "react-icons/fa";
import { TbTemperatureCelsius } from "react-icons/tb";
import { WiHumidity } from "react-icons/wi";
import { NavLink, Outlet } from "react-router-dom";

const Mainpage = () => {
  const [lastData, setLastData] = useState(null);

  useEffect(() => {
    const localStorageData = localStorage.getItem("esp32sensordataData");

    if (localStorageData) {
      const data = JSON.parse(localStorageData);
      const parseDateFromImagename = (imagename) => {
        const clean = imagename.replace(".jpg", "");
        const datetimePart = clean.split("D")[1]; // ได้ 2025-02-09T153223
        return datetimePart ? new Date(datetimePart.replace("T", "T").replace(/(\d{2})(\d{2})(\d{2})$/, "$1:$2:$3")) : new Date(0);
      };      

      data.sort((a, b) => {
        const dateA = parseDateFromImagename(a.imagename);
        const dateB = parseDateFromImagename(b.imagename);
        return dateA - dateB;
      });

      if (data.length > 0) {
        setLastData(data[data.length - 1]);
      } else {
        console.error("No data found in local storage.");
      }
    } else {
      console.error("No data found in local storage.");
    }
  }, []);

  const formatDateTime = (filename) => {
    const clean = filename.replace(/\.jpg$/, "");
    const datetimePart = clean.split("D")[1] || clean;
    const [date, time] = datetimePart.split("T");
    const [year, month, day] = date?.split("-") || ["0000", "00", "00"];
    const hour = time?.substring(0, 2) || "00";
    const minute = time?.substring(2, 4) || "00";
    const second = time?.substring(4, 6) || "00";
    return {
      formattedDate: `${day}/${month}/${year}`,
      formattedTime: `${hour}:${minute}:${second}`,
    };
  };

  return (
    <>
      <div className=" max-w-[screen] w-[100%] h-[100%] mx-auto flex flex-col items-center content-centertext-[black]">
        <div className="flex justify-end w-full mr-9 my-2">
          <FetchAllAndSaveButton />
          <ClearLocalStorageButton />
        </div>
        <div>
          {lastData && (
            <div>
              <p className="text-xl font-semibold text-center mb-4">
                Date: {formatDateTime(lastData.imagename).formattedDate}
                <br />
                Time: {formatDateTime(lastData.imagename).formattedTime}
              </p>
            </div>
          )}
        </div>
        <div className="flex 2xl:flex-row  2xl:w-screen 2xl:h-[600px] mb-[25px] items-center justify-center flex-col">
        <NavLink to="/RecomUv">
          <div className="flex flex-col bg-[#FFC876] 2xl:w-[800px] 2xl:h-[600px] 2xl:my-0 2xl:mr-[50px] rounded-3xl  md:w-[800px] sm:h-[275px] sm:mb-[25px] sm:w-[300px]">
            <div className=" my-[10px]">
              <h1>UV Index</h1>
            </div>
            <div className="flex md:w-[800px] h-full sm:w-[300px]">
              <div className="items-center m-auto pl-8 w-[400px] justify-center hidden sm:hidden md:block ">
                <MdOutlineWbSunny size="60%" />
              </div>
              <div className="items-center m-auto pl-6 w-[150px] justify-center hiden md:hidden sm:block">
                <MdOutlineWbSunny size="80%" />
              </div>
              <div className="flex md:w-[400px] items-center justify-center w-[150px]">
                {lastData && (
                  <div>
                    <p className=" md:text-[100px] sm:text-[50px]">
                      {lastData.UV}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          </NavLink>
          <div className="flex flex-col md:w-[800px] h-[600px] 2xl:ml-[50px] sm:w-[300px]">
            <div className=" flex flex-col bg-[#9fe293] md:w-[800px] h-[275px] rounded-3xl 2xl:mb-[25px] sm:w-[300px] sm:mb-[25px]">
              <NavLink to="/RecomTemp">
              <div className=" my-[10px]">
                <h1>Temperature</h1>
              </div>
              <div className="flex md:w-[800px] h-full sm:w-[300px]">
                <div className="items-center m-auto  w-[200px] justify-center hidden sm:hidden md:block ">
                  <FaTemperatureHigh size="50%" />
                </div>
                <div className="items-center m-auto pl-4 w-[150px] justify-center hiden md:hidden sm:block">
                  <FaTemperatureHigh size="100%" />
                </div>
                <div className="flex md:w-[400px] items-center justify-center sm:w-[300px]">
                  {lastData && (
                    <div className="flex justify-center items-center">
                      <p className=" md:text-[80px] sm:text-[45px] md:w-[200px] sm:-[75px]">
                        {lastData.temperature}
                      </p>
                      <div className="items-center w-[200px] justify-center hidden sm:hidden md:block sm:w-[75px]">
                        <TbTemperatureCelsius size="100%" />
                      </div>
                      <div className="items-center justify-center hiden md:hidden sm:block">
                        <TbTemperatureCelsius size={60} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </NavLink>
            </div>
            <div className=" flex flex-col bg-[#87B3F6] md:w-[800px] h-[275px] rounded-3xl  sm:w-[300px]">
            <NavLink to="/RecomTemp">
              <div className=" my-[10px]">
                <h1>Humidity</h1>
              </div>
              <div className="flex md:w-[800px] h-full sm:w-[300px]">
                <div className="items-center m-auto  w-[200px] justify-center hidden sm:hidden md:block">
                  <WiHumidity size="60%" />
                </div>
                <div className="items-center m-auto w-[150px] justify-center hiden md:hidden sm:block">
                  <WiHumidity size="100%" />
                </div>
                <div className="flex w-[400px] items-center justify-center ">
                  {lastData && (
                    <div className="flex justify-center items-center">
                      <p className=" md:text-[80px] sm:text-[45px] md:w-[400px] sm:w-[150px]">
                        {lastData.humidity}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
              </NavLink>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-[#c4c4b9] 2xl:w-[800px] 2xl:h-[500px] 2xl:my-0 2xl:mr-[50px] rounded-3xl  md:w-[800px] sm:h-[375px] sm:mb-[25px] sm:w-[300px] ">
          <div className=" my-[10px]">
            <h1>Location</h1>
          </div>
          {lastData && lastData.Latitude === 0 && lastData.Longitude == 0 ? (
            <p className="flex justify-center md:text-3xl ">
              You are in the Building
            </p>
          ) : (
            <MapDisplay
              latitude={lastData?.Latitude}
              longitude={lastData?.Longitude}
            />
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Mainpage;
