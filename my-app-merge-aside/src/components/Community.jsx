// src/components/Community.jsx

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, getDoc, setDoc } from "firebase/firestore";

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

const AdminPanel = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #fff;
  border: 2px solid #007bff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 300px;
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
      case 'admin':
        return '#6f42c1';
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

const UserStatusDisplay = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  background: ${props => props.isAdmin ? '#28a745' : '#17a2b8'};
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: bold;
  z-index: 1000;
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
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [users, setUsers] = useState([]);

  // 사용자 인증 상태 체크
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // 사용자가 로그인했을 때 관리자 권한 확인
        await checkAdminStatus(currentUser.uid);
        // 사용자 정보를 Firestore에 저장/업데이트
        await createOrUpdateUserDoc(currentUser);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 사용자 문서 생성/업데이트
  const createOrUpdateUserDoc = async (currentUser) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // 새 사용자인 경우 문서 생성
        await setDoc(userRef, {
          email: currentUser.email,
          displayName: currentUser.displayName || '',
          isAdmin: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      } else {
        // 기존 사용자인 경우 마지막 로그인 시간 업데이트
        await updateDoc(userRef, {
          lastLogin: new Date().toISOString(),
          email: currentUser.email,
          displayName: currentUser.displayName || ''
        });
      }
    } catch (error) {
      console.error("Error creating/updating user document:", error);
    }
  };

  // 관리자 권한 확인
  const checkAdminStatus = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // 🚨 개발용: 특정 이메일을 자동으로 관리자로 설정
        // 운영 환경에서는 이 부분을 제거해야 합니다!
        const ADMIN_EMAILS = [
          'admin@example.com',  // 여기에 관리자로 만들 이메일 추가
          'your-email@gmail.com'  // 본인 이메일로 변경하세요
        ];
        
        if (ADMIN_EMAILS.includes(userData.email)) {
          // 자동으로 관리자 권한 부여
          await updateDoc(doc(db, 'users', uid), { isAdmin: true });
          setIsAdmin(true);
          console.log(`🔥 ${userData.email}을 관리자로 자동 설정했습니다.`);
          return;
        }
        
        setIsAdmin(userData.isAdmin || false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  // 사용자 목록 불러오기 (관리자용)
  const fetchUsers = async () => {
    if (!isAdmin) return;
    
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // 관리자 권한 부여/제거
  const toggleUserAdminStatus = async (userId, currentStatus) => {
    if (!isAdmin) {
      alert("관리자 권한이 필요합니다.");
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        isAdmin: !currentStatus
      });
      
      alert(`사용자 권한이 ${!currentStatus ? '관리자로' : '일반 사용자로'} 변경되었습니다.`);
      fetchUsers(); // 사용자 목록 새로고침
    } catch (error) {
      console.error("Error updating user admin status:", error);
      alert("권한 변경에 실패했습니다.");
    }
  };

  // 이메일로 관리자 권한 부여
  const grantAdminByEmail = async () => {
    if (!adminEmail) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userDoc = usersSnapshot.docs.find(doc => 
        doc.data().email === adminEmail
      );

      if (userDoc) {
        await updateDoc(doc(db, 'users', userDoc.id), {
          isAdmin: true
        });
        alert("해당 사용자에게 관리자 권한을 부여했습니다.");
        setAdminEmail("");
        fetchUsers();
      } else {
        alert("해당 이메일로 가입된 사용자를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("Error granting admin by email:", error);
      alert("관리자 권한 부여에 실패했습니다.");
    }
  };

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
        author_email: user ? user.email : 'anonymous',
        createdAt: new Date().toISOString(),
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
    // 관리자가 아니고, 작성자도 아닌 경우 수정 불가
    if (!isAdmin && (!user || user.uid !== post.author_uid)) {
      alert("작성자 또는 관리자만 수정할 수 있습니다.");
      return;
    }
    
    setEditingId(post.id);
    setEditingTitle(post.title);
    setEditingContent(post.content);
  };

  const handleUpdate = async (postId, currentPassword) => {
    const collectionName = activeTab === 'qa' ? 'questions' : 'free';
    const post = posts.find(p => p.id === postId);
    
    // 관리자가 아니고, 작성자도 아닌 경우
    if (!isAdmin && (!user || user.uid !== post.author_uid)) {
      alert("작성자 또는 관리자만 수정할 수 있습니다.");
      return;
    }
    
    // 관리자가 아닌 경우 비밀번호 확인
    if (!isAdmin && post.password !== currentPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    try {
      const postRef = doc(db, collectionName, postId);
      await updateDoc(postRef, {
        title: editingTitle,
        content: editingContent,
        updatedAt: new Date().toISOString()
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
    const post = posts.find(p => p.id === postId);
    
    try {
      // 관리자가 아니고, 작성자도 아닌 경우
      if (!isAdmin && (!user || user.uid !== post.author_uid)) {
        alert("작성자 또는 관리자만 삭제할 수 있습니다.");
        return;
      }
      
      // 관리자가 아닌 경우 비밀번호 확인
      if (!isAdmin && post.password !== currentPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
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
    if (!user) {
      alert('댓글 작성은 로그인한 사용자만 가능합니다.');
      return;
    }
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
      author_uid: user.uid,
      author_email: user.email,
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
          {isAdmin && (
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
              (작성자: {post.author_email || 'unknown'})
            </span>
          )}
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
                  {/* 작성자 또는 관리자만 수정/삭제 버튼 표시 */}
                  {(isAdmin || (user && user.uid === post.author_uid)) && (
                    <>
                      <Button btnType="edit" onClick={() => handleEditClick(post)}>수정</Button>
                      <Button btnType="delete" onClick={() => { setPasswordAction({ type: 'delete', postId: post.id }); setShowPasswordModal(true); }}>삭제</Button>
                    </>
                  )}
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
                    {isAdmin && (
                      <small style={{ color: '#666' }}>
                        작성자: {comment.author_email || 'unknown'}
                      </small>
                    )}
                  </AnswerSection>
                ))}
                
                <div style={{ marginTop: '15px' }}>
                  {user ? (
                    // 비밀글인 경우 관리자만 댓글 가능, 일반글은 모든 로그인 사용자 댓글 가능
                    (activeTab === 'qa' && post.isPrivate && !isAdmin) ? (
                      <div style={{ 
                        padding: '15px', 
                        backgroundColor: '#fff3cd', 
                        border: '1px solid #ffeaa7', 
                        borderRadius: '5px',
                        textAlign: 'center',
                        color: '#856404'
                      }}>
                        비밀글에는 관리자만 댓글을 작성할 수 있습니다.
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleCommentSubmit(e, post.id)}>
                        <textarea
                          placeholder="답글 내용을 입력하세요..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          style={{ width: '100%', minHeight: '60px', padding: '8px' }}
                        />
                        <Button type="submit" btnType="user-answer">답글 등록</Button>
                      </form>
                    )
                  ) : (
                    <div style={{ 
                      padding: '15px', 
                      backgroundColor: '#f8f9fa', 
                      border: '1px solid #dee2e6', 
                      borderRadius: '5px',
                      textAlign: 'center',
                      color: '#6c757d'
                    }}>
                      댓글 작성은 로그인한 사용자만 가능합니다.
                    </div>
                  )}
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
      {user && (
        <UserStatusDisplay isAdmin={isAdmin}>
          {isAdmin ? '👑 관리자' : '👤 사용자'}: {user.email}
        </UserStatusDisplay>
      )}

      {isAdmin && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
          <Button btnType="admin" onClick={() => setShowAdminPanel(true)}>
            관리자 패널
          </Button>
        </div>
      )}

      {showAdminPanel && isAdmin && (
        <AdminPanel>
          <h3>👑 관리자 패널</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <h4>이메일로 관리자 권한 부여</h4>
            <input
              type="email"
              placeholder="사용자 이메일"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <Button btnType="submit" onClick={grantAdminByEmail}>
              관리자 권한 부여
            </Button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4>사용자 목록</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {users.map(userItem => (
                <div key={userItem.id} style={{ 
                  padding: '10px', 
                  border: '1px solid #eee', 
                  borderRadius: '5px', 
                  marginBottom: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{userItem.email}</strong>
                    <br />
                    <small style={{ color: userItem.isAdmin ? 'red' : 'blue' }}>
                      {userItem.isAdmin ? '관리자' : '일반 사용자'}
                    </small>
                  </div>
                  <Button 
                    btnType={userItem.isAdmin ? "delete" : "submit"}
                    onClick={() => toggleUserAdminStatus(userItem.id, userItem.isAdmin)}
                    style={{ fontSize: '12px', padding: '5px 10px' }}
                  >
                    {userItem.isAdmin ? '권한 해제' : '관리자 임명'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button btnType="default" onClick={() => setShowAdminPanel(false)}>
            패널 닫기
          </Button>
        </AdminPanel>
      )}

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
          <p>글 {passwordAction.type === 'delete' ? '삭제' : passwordAction.type === 'edit' ? '수정' : '열람'}을 위해 비밀번호를 입력하세요.</p>
          {isAdmin && (
            <p style={{ color: '#28a745', fontSize: '14px' }}>
              ✅ 관리자는 비밀번호 없이도 진행 가능합니다.
            </p>
          )}
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
    </CommunityContainer>
  );
}