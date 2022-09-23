import { FunctionComponent, useContext, useState } from "react";
import { GlobalAppContext } from "../../App";
import { numberToChar } from "../../utils/numberToChar";
import AxisCell from "../AxisCell/AxisCell";
import Cell from "../Cell/Cell";
import Column from "../Column/Column";
import { Menu, MenuItem } from "../ContextMenu/ContextMenu";
import AddRows from "../AddRows/AddRows";
import Row from "../Row/Row";
import classes from "./Sheet.module.css";

export type SheetProps = {};

const Sheet: FunctionComponent<SheetProps> = (props) => {
  const {
    cellState,
    handleAddColumn,
    handleAddRow,
    handleSortAtoZ,
    handleSortZtoA,
  } = useContext(GlobalAppContext);
  const [open, setOpen] = useState(false);
  const [currentCell, setCurrentCell] = useState<[number, number]>([-1, -1]);
  return (
    <div className={classes.SheetWrapper}>
      <Menu open={open} setOpen={setOpen}>
        <MenuItem
          label="Add 1 Column Right"
          handleClick={() => {
            let col = currentCell[1];
            if (currentCell[0] === 0) {
              col = col - 1;
            }
            handleAddColumn("RIGHT", col);
            setOpen(false);
          }}
        />
        <MenuItem
          label="Add 1 Column Left"
          handleClick={() => {
            let col = currentCell[1];
            if (currentCell[0] === 0) {
              col = col - 1;
            }
            handleAddColumn("LEFT", col);
            setOpen(false);
          }}
        />
        <MenuItem
          label="Add 1 Row Above"
          handleClick={() => {
            handleAddRow("ABOVE", currentCell[0]);
            setOpen(false);
          }}
        />
        <MenuItem
          label="Add 1 Row Below"
          handleClick={() => {
            handleAddRow("BELOW", currentCell[0]);
            setOpen(false);
          }}
        />
        {currentCell[0] === 0 && (
          <MenuItem
            label="Sort Sheet A to Z"
            handleClick={() => {
              handleSortAtoZ(currentCell[1]);
              setOpen(false);
            }}
          />
        )}
        {currentCell[0] === 0 && (
          <MenuItem
            label="Sort Sheet Z to A"
            handleClick={() => {
              handleSortZtoA(currentCell[1]);
              setOpen(false);
            }}
          />
        )}
      </Menu>
      <table className={classes.Sheet}>
        <tbody>
          <Row>
            {[...Array(cellState[0].length + 1)].map((column, columnIndex) =>
              columnIndex !== 0 ? (
                <AxisCell
                  key={columnIndex}
                  onClick={() => {
                    console.log(0, columnIndex);
                    setCurrentCell([0, columnIndex]);
                  }}
                >
                  {numberToChar(columnIndex - 1)}
                </AxisCell>
              ) : (
                <AxisCell key={columnIndex} />
              )
            )}
          </Row>
          {[...Array(cellState.length)].map((row, rowIndex) => (
            <Row key={rowIndex}>
              <AxisCell>{rowIndex + 1}</AxisCell>
              {[...Array(cellState[rowIndex].length)].map(
                (column, columnIndex) => (
                  <Column
                    key={columnIndex}
                    onClick={() => {
                      console.log(rowIndex, columnIndex);
                      setCurrentCell([rowIndex, columnIndex]);
                    }}
                  >
                    <Cell
                      rowIndex={rowIndex}
                      columnIndex={columnIndex}
                      cellId={`${rowIndex},${columnIndex}`}
                    />
                  </Column>
                )
              )}
            </Row>
          ))}
        </tbody>
      </table>
      <AddRows />
    </div>
  );
};

export default Sheet;
