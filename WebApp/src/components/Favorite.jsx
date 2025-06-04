import React, { useEffect, useState } from "react";
import MapDisplay from "./MapDisplay";
import { Outlet } from "react-router-dom";

const DisplayAllImagesFromLocalStorage = () => {
  const [imageDataArray, setImageDataArray] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dynamoDBData, setDynamoDBData] = useState([]);
  const [relatedDynamoDBData, setRelatedDynamoDBData] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const favsInLocalStorage = localStorage.getItem('favorites');
    return favsInLocalStorage ? JSON.parse(favsInLocalStorage) : [];
  });

  useEffect(() => {
    const imageDataFromLocalStorage = localStorage.getItem("favorites");
    const dynamoDataFromLocalStorage = localStorage.getItem("esp32sensordataData");

    if (imageDataFromLocalStorage) {
      const parsedImageData = JSON.parse(imageDataFromLocalStorage);
      parsedImageData.sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA - dateB;
      });
      setImageDataArray(parsedImageData);
    }

    if (dynamoDataFromLocalStorage) {
      setDynamoDBData(JSON.parse(dynamoDataFromLocalStorage));
    }
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

  const handleClick = (imageData) => {
    setSelectedImage(imageData);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handleFavorite = () => {
    const index = favorites.findIndex(fav => fav.name === selectedImage.name);
    if (index >= 0) {
      const newFavorites = [...favorites.slice(0, index), ...favorites.slice(index + 1)];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      const newFavorites = [...favorites, selectedImage];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };

  const showimage = () => (
    <div className="text-[black] flex flex-col items-center content-center">
      <h2 className="text-xl font-semibold mb-4">Favorite:</h2>
      <div className="flex justify-center w-full h-full">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {imageDataArray.map((imageData, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg cursor-pointer shadow md:w-[516px] md:h-[451px] sm:w-[380px] sm-h[451px]"
              onClick={() => handleClick(imageData)}
            >
              {imageData.name && (
                <p className="text-center mb-2">
                  Date: {formatDateTime(imageData.name).formattedDate}
                  <br />
                  Time: {formatDateTime(imageData.name).formattedTime}
                </p>
              )}
              <img
                className="w-full h-auto object-cover"
                src={imageData.url}
                alt={`Image ${index}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showimage()}
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
              style={{ backgroundColor: favorites.some(fav => fav.name === selectedImage.name) ? '#d9534f' : '#5cb85c' }}
            >
              {favorites.some(fav => fav.name === selectedImage.name) ? 'Remove from Favorites' : 'Add to Favorites'}
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
                      <MapDisplay latitude={data?.Latitude} longitude={data?.Longitude} />
                    )}
                    <p className="text-center">
                      <strong>Temperature:</strong> {data.temperature} °C
                      <br />
                      <strong>Humidity:</strong> {data.humidity}%
                    </p>
                    <p><strong>UV Index:</strong> {data.UV}</p>
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
      <Outlet />
    </>
  );
};

export default DisplayAllImagesFromLocalStorage;
