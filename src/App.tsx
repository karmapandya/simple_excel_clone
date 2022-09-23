import { createContext, useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import SheetsContainer from "./containers/SheetsContainer";
import { HyperFormula } from "hyperformula";

import "./App.css";

export interface GlobalContextInterface {
  cellState: string[][];
  handleCellChange: (...args: any[]) => void;
  handleAddNewRows: (rows: number) => void;
  handleAddColumn: (pos: string, column: number) => void;
  handleAddRow: (pos: string, row: number) => void;
  handleSortAtoZ: (column: number) => void;
  handleSortZtoA: (column: number) => void;
  reCalculateAllFormulas: () => void;
  setCellValue: (rowIndex: number, cellIndex: number, value: string) => void;
  getCellValue: (
    rowIndex: number,
    cellIndex: number,
    isEditMode: boolean
  ) => string;
}

let defaultValue = {
  cellState: [[]],
  handleCellChange: () => {},
  handleSortAtoZ: (column: number) => {},
  handleSortZtoA: (column: number) => {},
  handleAddNewRows: (rows: number) => {},
  reCalculateAllFormulas: () => {},
  handleAddColumn: (pos: string, column: number) => {},
  handleAddRow: (pos: string, row: number) => {},
  getCellValue: (rowIndex: number, cellIndex: number, isEditMode: boolean) => {
    return "NA";
  },
  setCellValue: (rowIndex: number, cellIndex: number, value: string) => {},
};

export const GlobalAppContext =
  createContext<GlobalContextInterface>(defaultValue);

function App() {
  const [cellState, setCellState] = useState<string[][]>(
    [...Array(20)].map((e) => Array(20).fill(""))
  );

  const [copyOfCellState, setCopyOfCellState] = useState<{
    [key: string]: string;
  }>({});

  function insertRowBelow(rowIndex: number) {
    let tempArr: string[][] = [...cellState];
    tempArr.splice(rowIndex + 1, 0, Array(tempArr[0].length).fill(""));
    tempArr.join();
    setCellState([...tempArr]);
  }
  function insertRowAbove(rowIndex: number) {
    let tempArr: string[][] = [...cellState];
    tempArr.splice(rowIndex, 0, Array(tempArr[0].length).fill(""));
    tempArr.join();
    setCellState([...tempArr]);
  }
  function insertColumnRight(colIndex: number) {
    let tempArr: string[][] = [...cellState];

    for (let i = 0; i < tempArr.length; i++) {
      let colArr = tempArr[i];
      colArr.splice(colIndex + 1, 0, "");
      colArr.join();
      tempArr[i] = colArr;
    }

    setCellState([...tempArr]);
  }
  function insertColumnLeft(colIndex: number) {
    let tempArr: string[][] = [...cellState];

    for (let i = 0; i < tempArr.length; i++) {
      let colArr = tempArr[i];
      colArr.splice(colIndex, 0, "");
      colArr.join();
      tempArr[i] = colArr;
    }

    setCellState([...tempArr]);
  }

  function reCalculateAllFormulas() {
    console.log("recalculate formulas");
    let tempArr = [...cellState];
    let tempMap: { [key: string]: string } = {
      ...copyOfCellState,
    };
    for (let i = 0; i < cellState.length; i++) {
      for (let j = 0; j < cellState[i].length; j++) {
        let value = cellState[i][j];
        if (value.startsWith("=")) {
          let modifiedValue = expressionParser(value, j, i);

          tempArr[i][j] = modifiedValue;
          tempMap[`mod_val_${i},${j}`] = value;
        }
      }
    }
    setCellState([...tempArr]);
    setCopyOfCellState({ ...tempMap });
  }

  function expressionParser(val: string, column: number, row: number): string {
    // define the options
    const options = {
      licenseKey: "gpl-v3",
    };
    console.log(column);
    console.log(row);
    if (val.startsWith("=")) {
      try {
        // build an instance with defined options and data
        const hfInstance = HyperFormula.buildFromArray(cellState, options);
        // call getCellValue to get the calculation results
        const mySum = hfInstance.getCellValue({
          col: column,
          row: row,
          sheet: 0,
        });
        console.log(mySum);
        return `${mySum}`;
      } catch (err) {
        console.log(err);
        return "Invalid Formula";
      }
    }

    return "Invalid Formula";
  }

  return (
    <RecoilRoot>
      <GlobalAppContext.Provider
        value={{
          cellState: cellState,
          handleCellChange: () => {},
          reCalculateAllFormulas: () => {
            reCalculateAllFormulas();
          },

          handleSortAtoZ: (column: number) => {
            let tempArr = [...cellState];
            console.log(column);
            tempArr.sort((a, b) => {
              if (a[column - 1] === b[column - 1]) {
                return 0;
              }
              // empty sort after anything else
              if (a[column - 1] === "") {
                return 1;
              }
              if (b[column - 1] === "") {
                return -1;
              } else {
                return a[column - 1] < b[column - 1] ? -1 : 1;
              }
            });
            console.log(tempArr);
            setCellState([...tempArr]);
          },
          handleSortZtoA: (column: number) => {
            let tempArr = [...cellState];
            console.log(column);
            tempArr.sort((a, b) => {
              if (a[column - 1] === b[column - 1]) {
                return 0;
              }
              // empty sort after anything else
              if (a[column - 1] === "") {
                return 1;
              }
              if (b[column - 1] === "") {
                return -1;
              } else {
                return a[column - 1] > b[column - 1] ? -1 : 1;
              }
            });
            console.log(tempArr);
            setCellState([...tempArr]);
          },
          handleAddColumn: (pos: string, column: number) => {
            console.log(pos);
            if (pos === "RIGHT") {
              insertColumnRight(column);
            }
            if (pos === "LEFT") {
              insertColumnLeft(column);
            }
          },
          handleAddRow: (pos: string, rowIndex: number) => {
            if (pos === "BELOW") {
              insertRowBelow(rowIndex);
            }
            if (pos === "ABOVE") {
              insertRowAbove(rowIndex);
            }
          },
          handleAddNewRows: (rows: number) => {
            let tempArr = [];
            for (let i = 0; i < rows; i++) {
              tempArr.push(Array(cellState[0].length).fill(""));
            }
            setCellState([
              ...cellState.map((elem, index) => cellState[index]),
              ...tempArr,
            ]);
          },
          getCellValue: (
            rowIndex: number,
            columnIndex: number,
            isEditMode: boolean
          ) => {
            if (isEditMode) {
              if (copyOfCellState[`mod_val_${rowIndex},${columnIndex}`]) {
                return copyOfCellState[`mod_val_${rowIndex},${columnIndex}`];
              } else {
                return cellState[rowIndex][columnIndex];
              }
            } else {
              return cellState[rowIndex][columnIndex];
            }
          },
          setCellValue: (
            rowIndex: number,
            cellIndex: number,
            value: string
          ) => {
            let tempArr = cellState;
            tempArr[rowIndex][cellIndex] = value;

            setCellState([...tempArr]);
          },
        }}
      >
        <SheetsContainer />
      </GlobalAppContext.Provider>
    </RecoilRoot>
  );
}

export default App;
