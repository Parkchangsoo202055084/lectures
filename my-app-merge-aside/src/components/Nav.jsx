// Nav.js
import logo from "../images/hanshin.png";
import styles from "./Nav.module.css";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const Nav = ({ activeTab, setActiveTab, onSearch, texts, onToggleLang }) => {
  const [query, setQuery] = useState("");
  const { user, loading, loginWithGoogle, loginWithEmail, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const tabs = [
    { id: "map", label: texts.aside.map.title },
    { id: "bus", label: texts.aside.bus.title },
    { id: "newB", label: texts.aside.newB.title },
    { id: "club", label: texts.aside.club.title },
    { id: "assist", label: texts.aside.assist.title },
  ];

  const submit = () => {
    if (!query.trim()) return;
    onSearch && onSearch(query.trim());
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  const goToHome = () => {
    setActiveTab("map");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailLoginClick = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (!validateEmail(email)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      alert("비밀번호는 6자리 이상이어야 합니다.");
      return;
    }

    await loginWithEmail(email, password);
  };

  const handleLogoutClick = async () => {
    await logout();
  };

  return (
    <header className={styles.header}>
      <div className={styles["top-bar"]}>
        <div className={styles["logo"]} onClick={goToHome} style={{ cursor: "pointer" }}>
          <img src={logo} alt={texts.nav.logoAlt} width="80" height="60" />
        </div>
        <div className={styles["search-box"]}>
          <input
            type="text"
            placeholder={texts.nav.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button
            className={styles["search-icon"]}
            onClick={submit}
            aria-label={texts.nav.searchAriaLabel}
          >
            🔍
          </button>
        </div>
        <div className={styles["auth-lang-container"]}>
          {user ? (
            // 로그인 상태일 때
            <>
              <div className={styles["user-info"]}>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className={styles["profile-img"]}
                  />
                )}
                <span className={styles["user-name"]}>
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                className={styles["auth-btn"]}
                onClick={handleLogoutClick}
                disabled={loading}
              >
                {loading ? "..." : texts.auth.logout}
              </button>
            </>
          ) : (
            // 로그아웃 상태일 때
            <>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles["auth-input"]}
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles["auth-input"]}
              />
              <button
                className={styles["auth-btn"]}
                onClick={handleEmailLoginClick}
                disabled={loading}
              >
                {loading ? "..." : "이메일 로그인"}
              </button>
              <button
                className={styles["auth-btn"]}
                onClick={loginWithGoogle}
                disabled={loading}
              >
                {loading ? "..." : "구글 로그인"}
              </button>
            </>
          )}
          <button className={styles["lang-btn"]} onClick={onToggleLang}>
            {texts.nav.langButton}
          </button>
        </div>
      </div>

      <nav className={styles["nav-bar"]}>
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? styles["active-tab"] : ""}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};