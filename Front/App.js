import React from "react";
import Card from "./Card";
import "./my-app.css";
import image1 from "./images/image1.png";
import image2 from "./images/image2.png";
import image3 from "./images/image3.png";
import image4 from "./images/image4.png";

const items = [
  {
    image: image1,
    title: "지금인기~색감원피스",
    subtitle: "무더위에 한벌로딱좋아",
    price: 65000,
    brand: "젬마월드",
  },
  {
    image: image2,
    title: "바로발송! 여름내내 입어",
    subtitle: "1+1 예쁜핏 여름원피스",
    price: 37000,
    brand: "미나그램",
  },
  {
    image: image3,
    title: "여름 침대위의 작은변화~",
    subtitle: "냉감침대패드 특가!",
    price: 31900,
    brand: "아이르",
  },
  {
    image: image4,
    title: "선화동 매운실비김치 신상",
    subtitle: "매콤 달콤 옛날떡볶이!",
    price: 16000,
    brand: "선화동매운김치",
  },
];

function App() {
  return (
    <div className="container">
      {items.map((item, index) => (
        <Card
          key={index}
          image={item.image}
          title={item.title}
          subtitle={item.subtitle}
          price={item.price}
          brand={item.brand}
        />
      ))}
    </div>
  );
}

export default App;
