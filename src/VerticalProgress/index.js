import React from "react";
import { Spring } from "react-spring/renderprops";
import "./VerticalProgress.css";

export const VerticalProgress = props => {
  const { points, current, next } = props;
  const nextMin = next ? next.min : current.min + 2;

  return (
    <React.Fragment>
      {next && <div>{next.min + " - " + next.title}</div>}
      <Spring from={{ percent: current.min }} to={{ percent: points }}>
        {({ percent }) => (
          <div className="progress vertical">
            <div
              style={{
                height: `${(100 * (percent - current.min)) /
                  (nextMin - current.min) +
                  1}%`
              }}
              className="progress-bar"
            >
              <span className="sr-only">{`${points}`}</span>
            </div>
          </div>
        )}
      </Spring>
      <div>{current.min + " - " + current.title}</div>
      <div>(Current rating)</div>
    </React.Fragment>
  );
};
