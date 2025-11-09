// src/components/BusInfo.jsx

import React from "react";
import BusLiveMap from "./BusLiveMap";
import {
  BusInfoContainer,
  Title,
  ImageContainer,
  InfoImage
} from '../css/BusInfoStyles';

const BusInfo = ({ selected, texts }) => {
  const busData = texts.busInfo[selected];

  // ✅ "정문 길찾기 지도" 또는 "Main Gate Map" 클릭 시: 이미지 대신 지도 보여주기
  if (selected === "정문 길찾기 지도" || selected === "Main Gate Map") {
    const data = texts.busInfo[selected];
    
    return (
      <BusInfoContainer>
        <Title>{data?.title}</Title>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <BusLiveMap />
        </div>
      </BusInfoContainer>
    );
  }

  if (!busData) {
    return (
      <BusInfoContainer>
        <p style={{ color: "#666" }}>{texts.busInfo.notReady}</p>
      </BusInfoContainer>
    );
  }

  return (
    <BusInfoContainer>
      <Title>{busData.title}</Title>
      <ImageContainer>
        {busData.images.map((image, index) => {
          try {
            const imagePath = require(`../images/${image.src}`);
            return (
              <InfoImage
                key={index}
                src={imagePath}
                alt={texts.busInfo.imageAlt[image.altKey]}
                style={image.style}
              />
            );
          } catch (error) {
            console.error(`Error loading image: ${image.src}`, error);
            return <div key={index}>Image not found: {image.src}</div>;
          }
        })}
      </ImageContainer>
    </BusInfoContainer>
  );
};

export default BusInfo;
