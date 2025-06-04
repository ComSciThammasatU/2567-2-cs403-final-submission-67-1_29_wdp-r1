import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import MapDisplay from "./MapDisplay";


const ImageGallery = () => {
  const [imageDataArray, setImageDataArray] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dynamoDBData, setDynamoDBData] = useState([]);
  const [relatedDynamoDBData, setRelatedDynamoDBData] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const favsInLocalStorage = localStorage.getItem("favorites");
    return favsInLocalStorage ? JSON.parse(favsInLocalStorage) : [];
  });

  useEffect(() => {
    const localStorageData = localStorage.getItem("imageDataArray");
    const dynamoDataFromLocalStorage = localStorage.getItem("esp32sensordataData");
    const rekognition = localStorage.getItem("RekogDataData");

    if (localStorageData) {
      const data = JSON.parse(localStorageData);
      setImageDataArray(data);
    }

    if (dynamoDataFromLocalStorage) {
      setDynamoDBData(JSON.parse(dynamoDataFromLocalStorage));
    }
    console.log(rekognition);
  }, []);

  useEffect(() => {
    if (selectedImage && dynamoDBData) {
      const imageNameWithoutExtension = selectedImage.name.replace(".jpg", "");
      const filteredData = dynamoDBData.filter(
        (item) => item.imagename === imageNameWithoutExtension
      );
      setRelatedDynamoDBData(filteredData);
    } else {
      setRelatedDynamoDBData(null);
    }
  }, [selectedImage, dynamoDBData]);
  // console.log(selectedImage);
  // console.log(relatedDynamoDBData);

  const extractDateParts = (filename) => {
    const clean = filename.replace(".jpg", "");
    const datetimePart = clean.split("D")[1] || clean; // รองรับ fallback
    const [date] = datetimePart.split("T");
    const [year, month, day] = date?.split("-") || ["0000", "00", "00"];
    return { year, month, day };
  };

  const handleClick = (image) => {
    console.log(image);
    // setSelectedImage(imageDataArray[image]);
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handleYearClick = (year) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setSelectedDate(null);
    setSelectedImages([]);
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    setSelectedDate(null);
    setSelectedImages([]);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);

    const filteredImages = imageDataArray
      .filter((image) => {
        const { year, month, day } = extractDateParts(image.name);
        return year === selectedYear && month === selectedMonth && day === date;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    setSelectedImages(filteredImages);
  };

  const renderYears = () => {
    if (selectedYear) return null;

    const years = Array.from(
      new Set(imageDataArray.map((image) => extractDateParts(image.name).year))
    );

    return years.map((year) => (
      <div
        key={year}
        className="bg-gradient-to-tr from-[#ecdea1] to-[#d3bb52] w-[400px] h-[500px] text-white p-4 rounded-lg cursor-pointer flex justify-center items-center my-4 mx-4"
        onClick={() => handleYearClick(year)}
      >
        {year}
      </div>
    ));
  };

  const renderMonths = () => {
    if (!selectedYear || selectedMonth) return null;

    const months = Array.from(
      new Set(
        imageDataArray
          .filter((image) => extractDateParts(image.name).year === selectedYear)
          .map((image) => extractDateParts(image.name).month)
      )
    );

    return months.map((month) => (
      <div
        key={month}
        className="bg-gradient-to-r from-[#e9da9a] to-[#d8be49] w-[400px] h-[500px] text-white p-4 rounded-lg cursor-pointer flex justify-center items-center my-4 mx-4"
        onClick={() => handleMonthClick(month)}
      >
        {month}
      </div>
    ));
  };

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

  const renderDates = () => {
    if (!selectedYear || !selectedMonth || selectedDate) return null;

    const dates = Array.from(
      new Set(
        imageDataArray
          .filter(
            (image) =>
              extractDateParts(image.name).year === selectedYear &&
              extractDateParts(image.name).month === selectedMonth
          )
          .map((image) => extractDateParts(image.name).day)
      )
    );

    return dates.map((date) => (
      <div
        key={date}
        className="bg-gradient-to-r from-[#ecdea1] to-[#d3bb52] w-[400px] h-[500px] text-white p-4 rounded-lg cursor-pointer flex justify-center items-center my-4 mx-4"
        onClick={() => handleDateClick(date)}
      >
        {date}
      </div>
    ));
  };

  const renderImages = () => {
    return selectedImages.map((image, index) => (
      <div
        key={index}
        className="bg-gray-100 p-4 rounded-lg text-black md:w-[516px] md:h-[451px] sm:w-[380px] sm-h[451px]"
        onClick={() => handleClick(image)}
      >
        {image.name && (
          <p className="text-center mb-2">
            Date: {formatDateTime(image.name).formattedDate}
            <br />
            Time: {formatDateTime(image.name).formattedTime}
          </p>
        )}
        <img
          className="w-full h-auto"
          src={image.url}
          alt={`Image ${index}`}
        />
      </div>
    ));
  };

  const category = () => {
    if (!selectedYear) {
      return <p className="text-xl font-semibold text-center mb-2">Select Years:</p>;
    } else if (selectedYear && !selectedMonth) {
      return <p className="text-xl font-semibold text-center mb-2">Select Months:</p>;
    } else if (selectedYear && selectedMonth && !selectedDate) {
      return <p className="text-xl font-semibold text-center mb-2">Select Dates:</p>;
    } else {
      return <p className="text-xl font-semibold text-center mb-2">Images:</p>;
    }
  };
  const handleFavorite = () => {
    const index = favorites.findIndex((fav) => fav.name === selectedImage.name);
    if (index >= 0) {
      const newFavorites = [
        ...favorites.slice(0, index),
        ...favorites.slice(index + 1),
      ];
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } else {
      const newFavorites = [...favorites, selectedImage];
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  return (
    <>
      <div className="text-[black] flex flex-col items-center content-center">
        {selectedImage ? (
          <div className="fixed inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center px-4 py-6">
            <div className="bg-white p-4 rounded-lg max-w-lg mx-auto">
              {selectedImage.name && (
                <p className="text-center mb-2">
                  Date: {formatDateTime(selectedImage.name).formattedDate}
                  <br />
                  Time: {formatDateTime(selectedImage.name).formattedTime}
                </p>
              )}
              <img
                className="md:w-[516px] md:h-[451px] sm:w-[380px] sm-h[451px]"
                src={selectedImage.url}
                alt="Selected Image"
              />
              <button
                onClick={handleFavorite}
                className="block w-full mt-2 px-4 py-2 text-white rounded-md"
                style={{
                  backgroundColor: favorites.some(
                    (fav) => fav.name === selectedImage.name
                  )
                    ? "#d9534f"
                    : "#5cb85c",
                }}
              >
                {favorites.some((fav) => fav.name === selectedImage.name)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
              {relatedDynamoDBData && relatedDynamoDBData.length > 0 && (
                <div className="mt-4">
                  {relatedDynamoDBData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center justify-center h-[250px]">
                    <p><strong>Location:</strong></p>
                    {data && data.Latitude == 0 && data.Longitude == 0 ? (
                      <div className=" flex w-full h-[200px] bg-[#FCF8ED] justify-center items-center">
                        <p className=" text-[20px] text-[red]">You are in the Building!</p>
                      </div>
                      ) : (
                        <MapDisplay
                          latitude={data?.Latitude}
                          longitude={data?.Longitude}
                        />
                      )}
                      <p className=" text-center">
                        <strong>Temperature:</strong> {data.temperature} °C
                        <br />
                        <strong>Humidity:</strong> {data.humidity}%
                      </p>
                      <p>
                        <strong>UV Index:</strong> {data.UV}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={handleClose}
                className="block w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
        <div className="my-4">{category()}</div>
        <div className="flex flex-row flex-wrap justify-center items-center">
          {renderYears()}
        </div>
        <div className="flex flex-row flex-wrap justify-center items-center">
          {renderMonths()}
        </div>
        <div className="flex flex-row flex-wrap justify-center items-center">
          {renderDates()}
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 ">
            {renderImages()}
          </div>
        </div>

        <Outlet />
      </div>
    </>
  );
};

export default ImageGallery;
