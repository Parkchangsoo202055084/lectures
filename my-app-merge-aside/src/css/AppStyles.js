import styled from 'styled-components';

export const Container = styled.div`
  display: flex;

  @media (min-width: 769px) {
    margin-top: 120px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 60px; 
  }
`;

export const MapSection = styled.div`
  width: 100%;
  display: ${(props) => (props.$active ? "block" : "none")};

  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 60px;
    z-index: 1;
    overflow: hidden;
  }
`;

export const MapLayout = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
    height: 100%;
    width: 100%;
  }
`;

export const MapBox = styled.div`
  flex: 2;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    
    & > div {
      width: 100% !important;
      height: 100% !important;
    }
  }
`;

export const DetailBox = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 600px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const MobilePopup = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "flex" : "none")};
    flex-direction: column;
    position: fixed;
    bottom: 60px;
    height: 35vh;
    left: 0;
    right: 0;
    background: white;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    max-height: 70vh;
    z-index: 1001;
    animation: slideUp 0.3s ease-out;

    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
  }
`;

export const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

export const PopupHandle = styled.div`
  width: 40px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin: 8px auto 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #000;
  }
`;

export const PopupContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

export const PopupOverlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
  }
`;
