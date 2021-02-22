import { updateWidget } from "actions/pageActions";
import { CANVAS_DEFAULT_WIDTH_PX } from "constants/AppConstants";
import { theme } from "constants/DefaultTheme";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppState } from "reducers";
import { getWidget } from "sagas/selectors";
import { useSelector } from "store";
import styled from "styled-components";
import { useWindowSizeHooks } from "utils/hooks/dragResizeHooks";
import { CanvasLayoutType } from "./WidgetsEditor";

const LayoutControlWrapper = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
  border-bottom: 4px solid ${(props) => props.theme.colors.artboard};
  .block {
    height: 40px;
    width: 40px;
    cursor: pointer;
    font-size: 14px;
  }
`;

export const MainContainerLayoutControl: React.FC<any> = () => {
  const { width } = useWindowSizeHooks();
  const mainContainer = useSelector((state: AppState) => getWidget(state, "0"));
  const [layoutType, setLayoutType] = useState<CanvasLayoutType>("fluid");
  const dispatch = useDispatch();
  useEffect(() => {
    updateLayout(layoutType);
  }, [layoutType]);
  useEffect(() => {
    if (layoutType === "fluid") {
      updateLayout(layoutType);
    }
  }, [width]);

  const updateLayout = (layoutType: CanvasLayoutType) => {
    const { leftColumn, topRow, bottomRow } = mainContainer;
    const layoutWidth =
      layoutType === "fluid"
        ? width - parseInt(theme.sidebarWidth)
        : CANVAS_DEFAULT_WIDTH_PX;
    dispatch(
      updateWidget("RESIZE", "0", {
        rightColumn: layoutWidth,
        leftColumn,
        topRow,
        bottomRow,
      }),
    );
    localStorage.setItem("LAYOUT", layoutType);
  };
  return (
    <LayoutControlWrapper>
      <button onClick={() => setLayoutType("fluid")}>Fluid</button>
      <button onClick={() => setLayoutType("fixed")}>Fixed</button>
    </LayoutControlWrapper>
  );
};
