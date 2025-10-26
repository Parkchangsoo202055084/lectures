// src/components/community/WriteModal.jsx

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Input,
  Textarea,
  FormGroup,
  Label,
  ActionButtons,
  Button,
  PostCard,
  PostHeader,
  PostTitle,
  PostMeta,
  PostContent,
  Badge,
  CommentCount,
  ExpandedContent,
  CommentSection,
  Comment,
  CommentHeader,
  CommentAuthor,
  CommentText,
  CommentForm,
  InfoBox
} from "./CommunityStyles";

// 글쓰기 모달
export const WritePostModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  newPost, 
  setNewPost, 
  activeTab 
}) => {
  if (!show) return null;

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>✏️ 새 글 작성</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <form onSubmit={onSubmit}>
          <FormGroup>
            <Input
              type="text"
              placeholder="제목을 입력하세요"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
          </FormGroup>
          
          <FormGroup>
            <Textarea
              placeholder="내용을 입력하세요"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              style={{ minHeight: '150px' }}
            />
          </FormGroup>
          
          <FormGroup>
            <Input
              type="password"
              placeholder="비밀번호 (수정/삭제 시 필요)"
              value={newPost.password}
              onChange={(e) => setNewPost({ ...newPost, password: e.target.value })}
            />
          </FormGroup>
          
          {activeTab === 'qa' && (
            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={newPost.isPrivate}
                  onChange={(e) => setNewPost({ ...newPost, isPrivate: e.target.checked })}
                />
                <span>🔒 비밀글로 작성 (비밀번호 입력 시 열람 가능)</span>
              </Label>
            </FormGroup>
          )}
          
          <ActionButtons>
            <Button type="submit" $variant="submit">✅ 글 올리기</Button>
            <Button type="button" $variant="cancel" onClick={onClose}>
              취소
            </Button>
          </ActionButtons>
        </form>
      </ModalContent>
    </Modal>
  );
};

// 비밀번호 확인 모달
export const PasswordConfirmModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  passwordInput, 
  setPasswordInput, 
  actionType,
  isAdmin 
}) => {
  if (!show) return null;

  const getActionText = () => {
    switch(actionType) {
      case 'delete': return '삭제';
      case 'edit': return '수정';
      case 'view': return '열람';
      default: return '';
    }
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <ModalHeader>
          <ModalTitle>🔐 비밀번호 확인</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <p style={{ color: '#666', marginBottom: '20px' }}>
          글 {getActionText()}을 위해 비밀번호를 입력하세요.
        </p>
        
        {isAdmin && (
          <InfoBox $type="info" style={{ marginBottom: '15px' }}>
            ✅ 관리자는 비밀번호 없이도 진행 가능합니다.
          </InfoBox>
        )}
        
        <FormGroup>
          <Input
            type="password"
            placeholder="비밀번호"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onConfirm()}
          />
        </FormGroup>
        
        <ActionButtons>
          <Button $variant="submit" onClick={onConfirm}>확인</Button>
          <Button $variant="cancel" onClick={onClose}>취소</Button>
        </ActionButtons>
      </ModalContent>
    </Modal>
  );
};

// 게시글 카드 컴포넌트
export const PostCardComponent = ({
  post,
  isExpanded,
  isEditing,
  editingTitle,
  setEditingTitle,
  editingContent,
  setEditingContent,
  onToggleExpand,
  onEditClick,
  onUpdateClick,
  onDeleteClick,
  onCancelEdit,
  onCommentSubmit,
  onDeleteComment,
  commentInput,
  setCommentInput,
  user,
  isAdmin,
  activeTab
}) => {
  const commentCount = post.comments?.length || 0;

  return (
    <PostCard>
      <PostHeader>
        <PostTitle onClick={() => onToggleExpand(post.id, post.isPrivate)}>
          <span>{activeTab === 'qa' && post.isPrivate ? "🔒" : "📢"}</span>
          <span>{post.title}</span>
        </PostTitle>
        <PostMeta>
          {commentCount > 0 && <CommentCount>💬 {commentCount}</CommentCount>}
          {isAdmin && <Badge $type="author">{post.author_email?.split('@')[0]}</Badge>}
        </PostMeta>
      </PostHeader>

      {isExpanded && (
        <ExpandedContent>
          {isEditing ? (
            <>
              <FormGroup>
                <Input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="제목"
                />
              </FormGroup>
              <FormGroup>
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  placeholder="내용"
                />
              </FormGroup>
              <ActionButtons>
                <Button $variant="submit" onClick={onUpdateClick}>
                  수정 완료
                </Button>
                <Button $variant="cancel" onClick={onCancelEdit}>취소</Button>
              </ActionButtons>
            </>
          ) : (
            <>
              <PostContent>{post.content}</PostContent>
              <ActionButtons>
                {(isAdmin || (user && user.uid === post.author_uid)) && (
                  <>
                    <Button $variant="edit" onClick={() => onEditClick(post)}>
                      ✏️ 수정
                    </Button>
                    <Button $variant="delete" onClick={onDeleteClick}>
                      🗑️ 삭제
                    </Button>
                  </>
                )}
              </ActionButtons>
              
              {post.comments && post.comments.length > 0 && (
                <CommentSection>
                  {post.comments.map((comment, index) => (
                    <Comment key={index} $isAdmin={comment.is_admin}>
                      <CommentHeader>
                        <CommentAuthor $isAdmin={comment.is_admin}>
                          {comment.is_admin ? "👑 관리자" : "👤 사용자"}
                        </CommentAuthor>
                        {(isAdmin || (user && user.uid === comment.author_uid)) && (
                          <Button 
                            $variant="delete" 
                            onClick={() => onDeleteComment(post.id, index, comment.author_uid)}
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            삭제
                          </Button>
                        )}
                      </CommentHeader>
                      <CommentText>{comment.content}</CommentText>
                      {isAdmin && (
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                          {comment.author_email}
                        </div>
                      )}
                    </Comment>
                  ))}
                </CommentSection>
              )}
              
              <CommentSection>
                {user ? (
                  (activeTab === 'qa' && post.isPrivate && !isAdmin) ? (
                    <InfoBox $type="warning">
                      비밀글에는 관리자만 댓글을 작성할 수 있습니다.
                    </InfoBox>
                  ) : (
                    <CommentForm onSubmit={(e) => onCommentSubmit(e, post.id)}>
                      <Textarea
                        placeholder="답글을 입력하세요..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                      />
                      <Button type="submit" $variant="answer" style={{ marginTop: '10px' }}>
                        💬 답글 등록
                      </Button>
                    </CommentForm>
                  )
                ) : (
                  <InfoBox>
                    댓글 작성은 로그인한 사용자만 가능합니다.
                  </InfoBox>
                )}
              </CommentSection>
            </>
          )}
        </ExpandedContent>
      )}
    </PostCard>
  );
};