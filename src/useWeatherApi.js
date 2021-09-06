import { useState, useEffect, useCallback } from "react";

// STEP 6-1：讓 fetchCurrentWeather 可以接收 locationName 作為參數
const fetchCurrentWeather = (locationName) => {
  // STEP 6-2：在 API 的網址中可以帶入 locationName 去撈取特定地區的天氣資料
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-FE42E18B-95B2-4D80-897C-8B01207D77B7&locationName=${locationName}`
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log("data", data);
      const locationData = data.records.location[0];

      const WeatherElement = locationData.weatherElement.reduce(
        (neededElement, item) => {
          if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
            //陣列解構賦值
            neededElement[item.elementName] = item.elementValue;
          }
          return neededElement;
          //neededElement[item.elementName] = item.elementValue;
          //return neededElement;
        },
        {}
      );

      console.log(WeatherElement);

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        description: "多雲時陰",
        temperature: WeatherElement.TEMP,
        windSpeed: WeatherElement.WDSD,
        humid: WeatherElement.HUMD
      };
    });
};

const fetchWeatherForcast = (cityName) => {
  // STEP 7-1：讓 fetchWeatherForecast 可以接收 cityName 作為參數
  return fetch(
    // STEP 7-2：在 API 的網址中可以帶入 cityName 去撈取特定地區的天氣資料
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-FE42E18B-95B2-4D80-897C-8B01207D77B7&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      };
    });
};

// STEP 1：讓 useWeatherApi 可以接收參數
const useWeatherApi = (currentLocation) => {
  // STEP 2：將傳入的 currentLocation 透過解構賦值取出 locationName 和 cityName
  const { locationName, cityName } = currentLocation;

  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: " ",
    description: " ",
    temperature: 0,
    windSpeed: 0,
    humid: 0,
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true
  });

  const fetchData = useCallback(() => {
    // 把原本的 fetchData 改名為 fetchingData 放到 useCallback 的函式內
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        // STEP 3：locationName 是給「觀測」天氣資料拉取 API 用的地區名稱
        fetchCurrentWeather(locationName),
        // STEP 4：cityName 是給「預測」天氣資料拉取 API 用的地區名稱
        fetchWeatherForcast(cityName)
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false
      });
    };

    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true
    }));
    //記得要呼叫 fetchingData 這個方法
    fetchingData();
    // STEP 5：將 locationName 和 cityName 帶入 useCallback 的 dependencies 中
  }, [locationName, cityName]);

  useEffect(() => {
    fetchData();
    //把透過 useCallback 回傳的函式放到 useEffect 的 dependencies 中
    // 說明：一旦 locationName 或 cityName 改變時，fetchData 就會改變，此時 useEffect 內的函式就會再次執行
    //，拉取最新的天氣資料
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherApi;
