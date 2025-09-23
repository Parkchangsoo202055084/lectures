import logo from "../images/hanshin.png";
import styles from "./Nav.module.css";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const Nav = ({ activeTab, setActiveTab, onSearch, texts, onToggleLang }) => {
  const [query, setQuery] = useState("");
  const { user, loading, login, logout } = useAuth();

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

  const handleAuthClick = async () => {
    if (user) {
      await logout();
    } else {
      await login();
    }
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
          {user && (
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
          )}
          <button
            className={styles["auth-btn"]}
            onClick={handleAuthClick}
            disabled={loading}
          >
            {loading ? "..." : (user ? texts.auth.logout : texts.auth.login)}
          </button>
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