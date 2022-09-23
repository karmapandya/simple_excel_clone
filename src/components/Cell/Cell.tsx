import {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { GlobalAppContext } from "../../App";
import classes from "./Cell.module.css";

export const CELL_WIDTH = 100;
export const CELL_HEIGHT = 25;

export type CellProps = {
  cellId: string;
  columnIndex: number;
  rowIndex: number;
};

const Cell: FunctionComponent<CellProps> = (props) => {
  const { getCellValue, setCellValue, reCalculateAllFormulas } =
    useContext(GlobalAppContext);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const changeLabeltoInput = () => {
    setIsEditMode(true);

    setTimeout(() => {
      inputRef.current?.focus();
    });
  };
  const changeInputToLabel = () => {
    setIsEditMode(false);
  };
  useEffect(() => {
    setInputVal(getCellValue(props.rowIndex, props.columnIndex, true));
  }, [isEditMode]);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    if (isLoaded && !isEditMode) {
      reCalculateAllFormulas();
    }
  }, [isEditMode]);

  const onClickOutsideInputHandler = (event: MouseEvent) => {
    if ((event.target as HTMLElement)?.dataset?.cellId !== props.cellId) {
      changeInputToLabel();
    }
  };

  const onDefocusInputHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsEditMode(false);
    }
  };

  const updateCellValueState = (event: ChangeEvent<HTMLInputElement>) => {
    setInputVal(event.target.value);
    setCellValue(props.rowIndex, props.columnIndex, event.target.value);
  };

  useEffect(() => {
    document.addEventListener("click", onClickOutsideInputHandler);

    return document.addEventListener("click", onClickOutsideInputHandler);
  });

  return isEditMode ? (
    <input
      className={classes.CellInput}
      ref={inputRef}
      data-cell-id={props.cellId}
      value={inputVal}
      onChange={updateCellValueState}
      onKeyDown={onDefocusInputHandler}
    />
  ) : (
    <div
      className={classes.CellLabel}
      data-cell-id={props.cellId}
      onClick={changeLabeltoInput}
    >
      {getCellValue(props.rowIndex, props.columnIndex, false)}
    </div>
  );
};

export default Cell;
