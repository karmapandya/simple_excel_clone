import React, { FunctionComponent } from "react";

export type RowProps = {
  children: any;
  onClick?: any;
};

const Row: FunctionComponent<RowProps> = (props) => {
  return <tr onClick={props.onClick}>{props.children}</tr>;
};

export default Row;
