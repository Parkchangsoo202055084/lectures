import logo from "../images/hanshin.png";
import styles from "./Nav.module.css";
import stylesA from "./Aside.module.css";

const Nav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "map", label: "캠퍼스 맵" },
    { id: "bus", label: "버스" },
    { id: "newB", label: "신입생" },
    { id: "club", label: "동아리" },
    { id: "assist", label: "학생지원" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles["top-bar"]}>
        <div className={styles["logo"]}>
          <img src={logo} alt="한신대학교 로고" width="80" height="60" />
        </div>
        <div className={styles["search-box"]}>
          <input type="text" placeholder="검색어를 입력하세요" />
          <button className={styles["search-icon"]}>🔍</button>
        </div>
        <button className={styles["lang-btn"]}>English</button>x
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

export default Nav;
