// src/components/community/Community.jsx

import React, { useState, useEffect, useCallback } from "react";
import { db, auth } from '../../firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { WritePostModal, PasswordConfirmModal, PostCardComponent } from "./WriteModal";
import {
  CommunityContainer,
  Header,
  Title,
  UserInfo,
  TabContainer,
  TabButton,
  PostList,
  FloatingWriteButton,
  EmptyState,
  Modal,
  AdminPanel,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormGroup,
  Input,
  Button,
  UserList,
  UserItem
} from "./CommunityStyles";

export default function Community() {
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
  const [showWriteModal, setShowWriteModal] = useState(false);
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
        await checkAdminStatus(currentUser.uid);
        await createOrUpdateUserDoc(currentUser);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const createOrUpdateUserDoc = async (currentUser) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: currentUser.email,
          displayName: currentUser.displayName || '',
          isAdmin: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      } else {
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

  const checkAdminStatus = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        const ADMIN_EMAILS = [
          'admin@example.com',
          'your-email@gmail.com'
        ];
        
        if (ADMIN_EMAILS.includes(userData.email)) {
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

  const fetchUsers = useCallback(async () => {
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
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, fetchUsers]);

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
      fetchUsers();
    } catch (error) {
      console.error("Error updating user admin status:", error);
      alert("권한 변경에 실패했습니다.");
    }
  };

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
      setShowWriteModal(false);
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
    
    if (!isAdmin && (!user || user.uid !== post.author_uid)) {
      alert("작성자 또는 관리자만 수정할 수 있습니다.");
      return;
    }
    
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
      if (!isAdmin && (!user || user.uid !== post.author_uid)) {
        alert("작성자 또는 관리자만 삭제할 수 있습니다.");
        return;
      }
      
      if (!isAdmin && post.password !== currentPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      
      await deleteDoc(doc(db, collectionName, postId));
      fetchPosts();
      setShowPasswordModal(false);
      setPasswordInput("");
      setExpandedId(null);
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
  
  return (
    <CommunityContainer>
      <Header>
        <Title>💬 커뮤니티</Title>
        {user && (
          <UserInfo $isAdmin={isAdmin}>
            <span>{isAdmin ? '👑' : '👤'}</span>
            <span>{user.email}</span>
          </UserInfo>
        )}
      </Header>

      <TabContainer>
        <TabButton
          $active={activeTab === 'qa'}
          onClick={() => setActiveTab('qa')}
        >
          📋 Q&A 게시판
        </TabButton>
        <TabButton
          $active={activeTab === 'free'}
          onClick={() => setActiveTab('free')}
        >
          ✨ 자유 게시판
        </TabButton>
      </TabContainer>

      {posts.length === 0 ? (
        <EmptyState>
          <div>📭</div>
          <p>아직 작성된 글이 없습니다.</p>
          <p style={{ fontSize: '14px', marginTop: '10px', color: '#ccc' }}>
            첫 번째 글을 작성해보세요!
          </p>
        </EmptyState>
      ) : (
        <PostList>
          {posts.map(post => (
            <PostCardComponent
              key={post.id}
              post={post}
              isExpanded={expandedId === post.id}
              isEditing={editingId === post.id}
              editingTitle={editingTitle}
              setEditingTitle={setEditingTitle}
              editingContent={editingContent}
              setEditingContent={setEditingContent}
              onToggleExpand={handleToggleExpand}
              onEditClick={handleEditClick}
              onUpdateClick={() => {
                setPasswordAction({ type: 'edit', postId: post.id });
                setShowPasswordModal(true);
              }}
              onDeleteClick={() => {
                setPasswordAction({ type: 'delete', postId: post.id });
                setShowPasswordModal(true);
              }}
              onCancelEdit={() => setEditingId(null)}
              onCommentSubmit={handleCommentSubmit}
              onDeleteComment={handleDeleteComment}
              commentInput={commentInput}
              setCommentInput={setCommentInput}
              user={user}
              isAdmin={isAdmin}
              activeTab={activeTab}
            />
          ))}
        </PostList>
      )}

      <FloatingWriteButton onClick={() => setShowWriteModal(true)}>
        ✏️
      </FloatingWriteButton>

      {/* 글쓰기 모달 */}
      <WritePostModal
        show={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        onSubmit={handleSubmit}
        newPost={newPost}
        setNewPost={setNewPost}
        activeTab={activeTab}
      />

      {/* 비밀번호 확인 모달 */}
      <PasswordConfirmModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordSubmit}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        actionType={passwordAction.type}
        isAdmin={isAdmin}
      />

      {/* 관리자 패널 버튼 */}
      {isAdmin && !showAdminPanel && (
        <div style={{ position: 'fixed', bottom: '100px', right: '30px', zIndex: 100 }}>
          <Button $variant="admin" onClick={() => setShowAdminPanel(true)}>
            👑 관리자 패널
          </Button>
        </div>
      )}

      {/* 관리자 패널 */}
      {showAdminPanel && isAdmin && (
        <Modal onClick={() => setShowAdminPanel(false)}>
          <AdminPanel onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>👑 관리자 패널</ModalTitle>
              <CloseButton onClick={() => setShowAdminPanel(false)}>×</CloseButton>
            </ModalHeader>
            
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ marginBottom: '10px', color: '#410f67' }}>이메일로 관리자 권한 부여</h4>
              <FormGroup>
                <Input
                  type="email"
                  placeholder="사용자 이메일"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </FormGroup>
              <Button $variant="submit" onClick={grantAdminByEmail}>
                관리자 권한 부여
              </Button>
            </div>

            <div>
              <h4 style={{ marginBottom: '10px', color: '#410f67' }}>사용자 목록</h4>
              <UserList>
                {users.map(userItem => (
                  <UserItem key={userItem.id}>
                    <div>
                      <strong>{userItem.email}</strong>
                      <br />
                      <small style={{ color: userItem.isAdmin ? '#dc3545' : '#007bff' }}>
                        {userItem.isAdmin ? '👑 관리자' : '👤 일반 사용자'}
                      </small>
                    </div>
                    <Button 
                      $variant={userItem.isAdmin ? "delete" : "submit"}
                      onClick={() => toggleUserAdminStatus(userItem.id, userItem.isAdmin)}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      {userItem.isAdmin ? '권한 해제' : '관리자 임명'}
                    </Button>
                  </UserItem>
                ))}
              </UserList>
            </div>

            <div style={{ marginTop: '20px' }}>
              <Button $variant="cancel" onClick={() => setShowAdminPanel(false)} style={{ width: '100%' }}>
                패널 닫기
              </Button>
            </div>
          </AdminPanel>
        </Modal>
      )}
    </CommunityContainer>
  );
}