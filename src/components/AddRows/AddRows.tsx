import { FunctionComponent, useContext, useState } from "react";
import { GlobalAppContext } from "../../App";
import styles from "./AddRows.module.css";

export type AddRowsProps = {};

const AddRows: FunctionComponent<AddRowsProps> = (props) => {
  const { cellState, handleAddNewRows } = useContext(GlobalAppContext);
  const [rows, setRows] = useState<string>("10");

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={() => {
          console.log("adding rows");
          handleAddNewRows(parseInt(rows));
        }}
      >
        Add
      </button>
      <input
        type="text"
        className={styles.input}
        value={rows}
        onChange={(e) => {
          let isnum = /^\d+$/.test(e.target.value);
          if (e.target.value === "") {
            setRows(`0`);
          }
          if (isnum) {
            let tempStr = e.target.value;
            if (tempStr[0] === "0") {
              let newStr = tempStr.replace("0", "");
              setRows(newStr);
            } else {
              setRows(e.target.value);
            }
          }
        }}
      />
      <span className={styles.text}>more rows at bottom</span>
    </div>
  );
};

export default AddRows;
