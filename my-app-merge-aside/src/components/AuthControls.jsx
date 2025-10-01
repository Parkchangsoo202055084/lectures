// AuthControls.jsx
import React, { useState, useEffect } from "react";
import styles from "./Nav.module.css"; 
import { useAuth } from "../hooks/useAuth"; 

export const AuthControls = ({ texts, onToggleLang, isMobile }) => {
    const { user, loading, loginWithGoogle, loginWithEmail, logout } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [error, setError] = useState(""); 

    const handleEmailLoginClick = async () => {
        if (loading) return;
        if (!email || !password) {
            setError(texts.auth.emptyInput || "이메일과 비밀번호를 입력해주세요.");
            return;
        }
        setError("");
        try {
            await loginWithEmail(email, password);
            setShowLoginModal(false);
        } catch (e) {
            setError(e.message || texts.auth.emailLoginFailed || "이메일 로그인에 실패했습니다.");
        }
    };
    
    const handleGoogleLoginClick = async () => {
        if (loading) return;
        setError("");
        try {
            await loginWithGoogle();
            setShowLoginModal(false);
        } catch (e) {
            setError(e.message || texts.auth.googleLoginFailed || "구글 로그인에 실패했습니다.");
        }
    };

    const handleLogoutClick = async () => {
        if (loading) return;
        setError("");
        try {
            await logout();
        } catch (e) {
            console.error("로그아웃 실패:", e);
        }
    };

    useEffect(() => {
        if (!showLoginModal) {
            setEmail("");
            setPassword("");
            setError("");
        }
    }, [showLoginModal]);

    return (
        <>
            {/* ⭐️ 버튼 컨트롤 */}
            <div className={`${styles["auth-lang-container"]} ${isMobile ? styles["auth-lang-mobile"] : ''}`}>
                {user ? (
                    <>
                        {isMobile ? (
                            <div className={styles["user-icon"]} onClick={handleLogoutClick} aria-label={texts.auth.logout || "로그아웃"}>
                                {user.photoURL ? 
                                    <img src={user.photoURL} alt="Profile" className={styles["profile-img"]} /> : 
                                    "👤"
                                }
                            </div>
                        ) : (
                            <>
                                <div className={styles["user-info"]}>
                                    {user.photoURL && <img src={user.photoURL} alt="Profile" className={styles["profile-img"]} />}
                                    <span className={styles["user-name"]}>{user.displayName || user.email}</span>
                                </div>
                                <button className={styles["auth-btn"]} onClick={handleLogoutClick} disabled={loading}>
                                    {loading ? "..." : texts.auth.logout}
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <button 
                        className={isMobile ? styles["auth-icon-btn"] : styles["auth-btn"]} 
                        onClick={() => setShowLoginModal(true)} 
                        disabled={loading} 
                        aria-label={texts.auth.login || "로그인"}
                    >
                        {loading ? "..." : (isMobile ? "🔓" : texts.auth.login || "로그인")}
                    </button>
                )}
                
                <button 
                    className={isMobile ? styles["lang-icon-btn"] : styles["lang-btn"]} 
                    onClick={onToggleLang} 
                    aria-label={texts.nav.langButton}
                >
                    {isMobile ? "🌐" : texts.nav.langButton}
                </button>
            </div>

            {/* ⭐️ 로그인 모달 */}
            {showLoginModal && (
                <div className={styles["modal-backdrop"]} onClick={() => setShowLoginModal(false)}>
                    <div className={styles["login-modal"]} onClick={(e) => e.stopPropagation()}>
                        <button className={styles["close-button"]} onClick={() => setShowLoginModal(false)}>
                            &times;
                        </button>
                        <h2 className={styles["modal-title"]}>{texts.auth.login || "로그인"}</h2>

                        <div className={styles["login-form"]}>
                            <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} className={styles["auth-input-modal"]} />
                            <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} className={styles["auth-input-modal"]} />
                            {error && <p className={styles["error-message"]}>{error}</p>}
                            <button className={styles["auth-btn-modal"]} onClick={handleEmailLoginClick} disabled={loading}>
                                {loading ? "..." : texts.auth.emailLogin || "이메일로 로그인"}
                            </button>
                        </div>

                        <div className={styles["divider-modal"]}>또는</div>

                        <button className={`${styles["auth-btn-modal"]} ${styles["google-btn"]}`} onClick={handleGoogleLoginClick} disabled={loading}>
                            {loading ? "..." : "🔑 구글 계정으로 로그인"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};