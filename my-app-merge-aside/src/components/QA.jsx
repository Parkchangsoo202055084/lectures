// src/components/QA.jsx

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { db, auth } from '../firebase'; // auth 추가
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

const CommunityContainer = styled.div`
  padding: 20px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? '#007bff' : '#f0f0f0')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${(props) => (props.active ? '#0056b3' : '#e0e0e0')};
  }
`;

const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px dashed #ccc;
  border-radius: 8px;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PostItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background: #f9f9f9;
`;

const PostTitle = styled.h4`
  margin: 0;
  cursor: pointer;
  color: #333;
`;

const PostContent = styled.p`
  margin: 10px 0 0;
  color: #666;
  white-space: pre-wrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const AnswerSection = styled.div`
  margin-top: 15px;
  padding: 10px;
  background: #fff;
  border-left: 3px solid #28a745;
  border-radius: 4px;
`;

const PasswordModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  background-color: ${(props) => {
    switch (props.btnType) {
      case 'edit':
        return '#ffc107';
      case 'delete':
        return '#dc3545';
      case 'submit':
        return '#007bff';
      case 'answer':
        return '#28a745';
      case 'user-answer':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  }};
  &:hover {
    opacity: 0.9;
  }
`;

const FreePostItem = styled(PostItem)`
  background: #e9f5ff;
`;

export default function QA() {
  const [activeTab, setActiveTab] = useState('qa');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    password: "",
    isPrivate: false,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState({ type: null, postId: null });
  const [passwordInput, setPasswordInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const fetchPosts = useCallback(async () => {
    const collectionName = activeTab === 'qa' ? 'questions' : 'free';
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const postList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postList);
    } catch (e) {
      console.error("Error fetching documents: ", e);
      setPosts([]);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.password) {
      alert("제목, 내용, 비밀번호를 모두 입력해주세요.");
      return;
    }
    const collectionName = activeTab === 'qa' ? 'questions' : 'free';
    const postData = {
        title: newPost.title,
        content: newPost.content,
        password: newPost.password,
        comments: [],
        author_uid: user ? user.uid : 'anonymous',
    };

    if (activeTab === 'qa') {
        postData.isPrivate = newPost.isPrivate;
    }
    
    try {
      await addDoc(collection(db, collectionName), postData);
      setNewPost({ title: "", content: "", password: "", isPrivate: false });
      fetchPosts();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleToggleExpand = (id, isPrivate) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    if (isPrivate && activeTab === 'qa' && !isAdmin) {
      setPasswordAction({ type: 'view', postId: id });
      setShowPasswordModal(true);
      return;
    }
    setExpandedId(id);
  };

  const handleEditClick = (post) => {
    setEditingId(post.id);
    setEditingTitle(post.title);
    setEditingContent(post.content);
  };

  const handleUpdate = async (postId, currentPassword) => {
    const collectionName = activeTab === 'qa' ? 'questions' : 'free';
    const post = posts.find(p => p.id === postId);
    if (!isAdmin && post.password !== currentPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const postRef = doc(db, collectionName, postId);
      await updateDoc(postRef, {
        title: editingTitle,
        content: editingContent
      });
      setEditingId(null);
      fetchPosts();
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("글 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (postId, currentPassword) => {
    const collectionName = activeTab === 'qa' ? 'questions' : 'free';
    try {
      if (!isAdmin) {
        const post = posts.find(p => p.id === postId);
        if (post.password !== currentPassword) {
          alert("비밀번호가 일치하지 않습니다.");
          return;
        }
      }
      await deleteDoc(doc(db, collectionName, postId));
      fetchPosts();
      setShowPasswordModal(false);
      setPasswordInput("");
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const handlePasswordSubmit = () => {
    const { type, postId } = passwordAction;
    const post = posts.find(p => p.id === postId);

    if (isAdmin || post.password === passwordInput) {
      if (type === 'view') {
        setExpandedId(postId);
      } else if (type === 'edit') {
        handleUpdate(postId, passwordInput);
      } else if (type === 'delete') {
        handleDelete(postId, passwordInput);
      }
      setShowPasswordModal(false);
      setPasswordInput("");
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };
  
  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    if (!commentInput) {
      alert('답글 내용을 입력해주세요.');
      return;
    }
    const collectionName = activeTab === 'qa' ? 'questions' : 'free';
    const post = posts.find(p => p.id === postId);
    const newComment = {
      content: commentInput,
      timestamp: new Date().toISOString(),
      is_admin: isAdmin,
      author_uid: user ? user.uid : 'anonymous',
    };
    
    try {
      const docRef = doc(db, collectionName, postId);
      await updateDoc(docRef, {
        comments: [...(post.comments || []), newComment]
      });
      setCommentInput('');
      fetchPosts();
    } catch (e) {
      console.error("Error updating document: ", e);
      alert('답글 등록에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (postId, commentIndex, commentAuthorId) => {
    if (user && user.uid !== commentAuthorId && !isAdmin) {
        alert("자신이 작성한 답글만 삭제할 수 있습니다.");
        return;
    }

    const collectionName = activeTab === 'qa' ? 'questions' : 'free';
    const post = posts.find(p => p.id === postId);
    const updatedComments = post.comments.filter((_, index) => index !== commentIndex);

    try {
      const docRef = doc(db, collectionName, postId);
      await updateDoc(docRef, { comments: updatedComments });
      fetchPosts();
    } catch (e) {
      console.error("Error deleting comment: ", e);
      alert("답글 삭제에 실패했습니다.");
    }
  };

  const renderPostItem = (post) => {
    const PostComponent = activeTab === 'qa' ? PostItem : FreePostItem;
    return (
      <PostComponent key={post.id}>
        <PostTitle onClick={() => handleToggleExpand(post.id, post.isPrivate)}>
          {activeTab === 'qa' && post.isPrivate ? "🔒" : "📢"}{' '}
          {post.title}
        </PostTitle>
        {expandedId === post.id && (
          <>
            {editingId === post.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  style={{ width: '100%', margin: '10px 0' }}
                />
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  style={{ width: '100%', minHeight: '80px' }}
                />
                <ActionButtons>
                  <Button btnType="submit" onClick={() => { setPasswordAction({ type: 'edit', postId: post.id }); setShowPasswordModal(true); }}>수정 완료</Button>
                  <Button btnType="default" onClick={() => setEditingId(null)}>취소</Button>
                </ActionButtons>
              </>
            ) : (
              <>
                <PostContent>{post.content}</PostContent>
                <ActionButtons>
                  <Button btnType="edit" onClick={() => handleEditClick(post)}>수정</Button>
                  <Button btnType="delete" onClick={() => { setPasswordAction({ type: 'delete', postId: post.id }); setShowPasswordModal(true); }}>삭제</Button>
                </ActionButtons>
                
                {post.comments && post.comments.map((comment, index) => (
                  <AnswerSection key={index}>
                    <p>
                      <strong>[{comment.is_admin ? "관리자" : "사용자"}] 답글:</strong>{' '}
                      {comment.content}
                      {(isAdmin || (user && user.uid === comment.author_uid)) && (
                        <Button onClick={() => handleDeleteComment(post.id, index, comment.author_uid)} style={{ marginLeft: '10px', backgroundColor: '#dc3545', padding: '5px 8px', fontSize: '12px' }}>삭제</Button>
                      )}
                    </p>
                  </AnswerSection>
                ))}
                
                <div style={{ marginTop: '15px' }}>
                  <form onSubmit={(e) => handleCommentSubmit(e, post.id)}>
                    <textarea
                      placeholder="답글 내용을 입력하세요..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      style={{ width: '100%', minHeight: '60px', padding: '8px' }}
                    />
                    <Button type="submit" btnType="user-answer">답글 등록</Button>
                  </form>
                </div>
              </>
            )}
          </>
        )}
      </PostComponent>
    );
  };
  
  return (
    <CommunityContainer>
      <TabContainer>
        <TabButton
          active={activeTab === 'qa'}
          onClick={() => setActiveTab('qa')}
        >
          QA 게시판
        </TabButton>
        <TabButton
          active={activeTab === 'free'}
          onClick={() => setActiveTab('free')}
        >
          자유 게시판
        </TabButton>
      </TabContainer>

      <h2>📖 {activeTab === 'qa' ? 'Q&A 게시판' : '자유 게시판'}</h2>
      
      <hr />

      <PostForm onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          style={{ padding: "10px", border: "1px solid #ddd" }}
        />
        <textarea
          placeholder="내용"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          style={{ padding: "10px", border: "1px solid #ddd", minHeight: "80px" }}
        />
        <input
          type="password"
          placeholder="비밀번호 (수정/삭제 시 필요)"
          value={newPost.password}
          onChange={(e) => setNewPost({ ...newPost, password: e.target.value })}
          style={{ padding: "10px", border: "1px solid #ddd" }}
        />
        {activeTab === 'qa' && (
          <label>
            <input
              type="checkbox"
              checked={newPost.isPrivate}
              onChange={(e) => setNewPost({ ...newPost, isPrivate: e.target.checked })}
            />
            비밀글 (비밀번호 입력 시 열람 가능)
          </label>
        )}
        <Button type="submit" btnType="submit">글 올리기</Button>
      </PostForm>
      
      <hr />

      <PostList>
        {posts.map(renderPostItem)}
      </PostList>

      {showPasswordModal && (
        <PasswordModal>
          <h3>비밀번호 확인</h3>
          <p>글 {passwordAction.type === 'delete' ? '삭제' : '수정'}를 위해 비밀번호를 입력하세요.</p>
          <input
            type="password"
            placeholder="비밀번호"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ padding: "10px", border: "1px solid #ddd" }}
          />
          <div>
            <Button btnType="submit" onClick={handlePasswordSubmit}>확인</Button>
            <Button btnType="default" onClick={() => setShowPasswordModal(false)}>취소</Button>
          </div>
        </PasswordModal>
      )}

      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <button onClick={() => setIsAdmin(prev => !prev)} style={{ padding: '10px', backgroundColor: isAdmin ? 'red' : 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isAdmin ? '관리자 모드 해제' : '관리자 모드 활성화'}
        </button>
      </div>
    </CommunityContainer>
  );
}