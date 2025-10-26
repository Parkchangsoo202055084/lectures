import React from "react";
import styled from "styled-components";
import BusLiveMap from "./BusLiveMap";

const BusInfoContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const BusInfo = ({ selected, texts }) => {
  const busData = texts.busInfo[selected];

  // ✅ "정문 길찾기 지도" 클릭 시: 이미지 대신 지도 보여주기
  if (selected === "정문 길찾기 지도") {
    return (
      <BusInfoContainer>
        <Title>한신대 정문 정류장 — 길찾기 지도</Title>
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
