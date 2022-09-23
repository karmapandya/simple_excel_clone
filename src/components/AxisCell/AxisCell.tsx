import React, { FunctionComponent } from "react";
import classes from "./AxisCell.module.css";

export type AxisCellProps = {
  children?: any;
  onClick?: any;
};

const AxisCell: FunctionComponent<AxisCellProps> = (props) => {
  return (
    <th
      className={classes.AxisCell}
      onClick={props.onClick}
      onContextMenu={props.onClick}
    >
      {props.children}
    </th>
  );
};

export default AxisCell;
