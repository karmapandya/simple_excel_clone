import React, { FunctionComponent } from "react";
import classes from "./Column.module.css";

export type ColumnProps = {
  children?: any;
  onClick?: any;
};

const Column: FunctionComponent<ColumnProps> = (props) => {
  return (
    <td
      className={classes.Column}
      onClick={props.onClick}
      onContextMenu={props.onClick}
    >
      {props.children}
    </td>
  );
};

export default Column;
