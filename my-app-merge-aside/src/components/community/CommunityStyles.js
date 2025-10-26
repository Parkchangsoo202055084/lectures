// src/components/community/CommunityStyles.js

import styled from "styled-components";

export const CommunityContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 100px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 768px) {
    padding: 15px;
    padding-bottom: 120px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const Title = styled.h1`
  color: #410f67;
  margin: 0;
  font-size: 28px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: ${props => props.$isAdmin ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.$isAdmin ? 'white' : '#333'};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

export const TabButton = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'transparent'};
  color: ${props => props.$active ? 'white' : '#666'};
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : '#f5f5f5'};
    color: ${props => props.$active ? 'white' : '#333'};
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
    flex: 1;
  }
`;

export const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const PostCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    border-color: #667eea;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 10px;
`;

export const PostTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
`;

export const PostContent = styled.p`
  margin: 10px 0 0 0;
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => {
    if (props.$type === 'private') return '#ff6b6b';
    if (props.$type === 'author') return '#4285f4';
    return '#28a745';
  }};
  color: white;
`;

export const CommentCount = styled.span`
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
`;

export const ExpandedContent = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  background: ${props => {
    switch (props.$variant) {
      case 'edit': return '#ffc107';
      case 'delete': return '#dc3545';
      case 'submit': return '#667eea';
      case 'answer': return '#28a745';
      case 'cancel': return '#6c757d';
      case 'admin': return '#6f42c1';
      default: return '#667eea';
    }
  }};

  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

export const CommentSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

export const Comment = styled.div`
  background: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  border-left: 3px solid ${props => props.$isAdmin ? '#667eea' : '#28a745'};
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const CommentAuthor = styled.span`
  font-weight: 600;
  color: ${props => props.$isAdmin ? '#667eea' : '#28a745'};
  font-size: 14px;
`;

export const CommentText = styled.p`
  margin: 0;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
`;

export const CommentForm = styled.form`
  margin-top: 15px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  @media (max-width: 768px) {
    min-height: 60px;
  }
`;

export const InfoBox = styled.div`
  padding: 15px;
  background: ${props => {
    if (props.$type === 'warning') return '#fff3cd';
    if (props.$type === 'info') return '#d1ecf1';
    return '#f8f9fa';
  }};
  border: 1px solid ${props => {
    if (props.$type === 'warning') return '#ffeaa7';
    if (props.$type === 'info') return '#bee5eb';
    return '#dee2e6';
  }};
  border-radius: 8px;
  text-align: center;
  color: ${props => {
    if (props.$type === 'warning') return '#856404';
    if (props.$type === 'info') return '#0c5460';
    return '#6c757d';
  }};
  font-size: 14px;
`;

export const FloatingWriteButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    bottom: 80px;
    width: 56px;
    height: 56px;
    font-size: 24px;
  }
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #410f67;
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #333;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

export const AdminPanel = styled(ModalContent)`
  max-width: 500px;
`;

export const UserList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-top: 15px;
`;

export const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f8f9fa;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;

  svg {
    font-size: 48px;
    margin-bottom: 15px;
  }

  p {
    font-size: 16px;
    margin: 0;
  }
`;