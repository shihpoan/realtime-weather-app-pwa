import React from "react";
import styled from "@emotion/styled";
import WeatherIcon from "./WeatherIcon.js";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as ReFreshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";
import { ReactComponent as CogIcon } from "./images/cog.svg";

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
  //text-align: center;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 8px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    /* STEP 2：使用 rotate 動畫效果在 svg 圖示上 */
    animation: rotate infinite 1.5s linear;
    /* STEP 2：取得傳入的 props 並根據它來決定動畫要不要執行 */
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }

  /* STEP 1：定義旋轉的動畫效果，並取名為 rotate */
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

// STEP 2：為 CogIcon 添加樣式
const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

const WeatherCard = (props) => {
  // STEP 1：從 props 中取出 cityName
  const { cityName, weatherElement, moment, fetchData, setCurrentPage } = props;

  const {
    //物件的解構賦值，減少程式碼 例： weatherElement.locationName -> locationName
    observationTime,
    //locationName,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading
  } = weatherElement;

  return (
    <WeatherCardWrapper>
      <Cog onClick={() => setCurrentPage("WeatherSetting")} />
      {/* STEP 2：將 cityName 帶入 */}
      <Location>{cityName}</Location>
      <Description>
        {description} {comfortability}
      </Description>
      <CurrentWeather>
        <Temperature>
          {Math.round(temperature)}
          <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon
          currentWeatherCode={weatherCode}
          moment={moment || "day"}
        />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon />
        {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon />
        {Math.round(rainPossibility)}%
      </Rain>
      <Refresh
        onClick={() => {
          fetchData();
        }}
        isLoading={isLoading}
      >
        以上由 Captain Purple 提供 ，最後觀測時間：
        {new Intl.DateTimeFormat("zh-TW", {
          hour: "numeric",
          minute: "numeric"
        }).format(new Date(observationTime))}{" "}
        {isLoading ? <LoadingIcon /> : <ReFreshIcon />}
      </Refresh>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
