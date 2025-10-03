// FILE: src/components/BusInfo.js

import React from 'react';
import styled from 'styled-components';

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

  if (!busData) {
    return (
      <BusInfoContainer>
        <p style={{ color: '#666' }}>{texts.busInfo.notReady}</p>
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