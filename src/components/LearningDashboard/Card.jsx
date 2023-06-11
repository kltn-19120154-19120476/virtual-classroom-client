import { Typography } from "@mui/material";
import React from "react";

function Card(props) {
  const { number, name, children, iconClass, cardClass } = props;

  let icons;

  try {
    React.Children.only(children);
    icons = <div>{children}</div>;
  } catch (e) {
    icons = (
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {React.Children.map(children, (child, index) => {
          let offset = 4 / (index + 1);
          offset = index === React.Children.count(children) - 1 ? 0 : offset;

          return (
            <Typography variant="span" color="primary">
              {child}
            </Typography>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} className={cardClass}>
      <div style={{ textAlign: "left", fontSize: "1.3rem" }}>
        <Typography color="primary" variant="p" sx={{ fontWeight: 600 }}>
          {number}
        </Typography>
        <p>{name}</p>
      </div>
      {icons}
    </div>
  );
}

export default Card;
