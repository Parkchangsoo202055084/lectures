import React from "react";
import "./my-app.css";
import "./styles.scss";
function Card(props) {
  return (
    <div className="card">
      <img className="product-img" src={props.image} alt="product" />
      <div className="card-info">
        <p className="title">{props.title}</p>
        <p className="subtitle">{props.subtitle}</p>
        <p className="price">
          <strong>{props.price.toLocaleString()}원</strong>
        </p>
        <p className="brand">{props.brand}</p>
      </div>
    </div>
  );
}

export default Card;
