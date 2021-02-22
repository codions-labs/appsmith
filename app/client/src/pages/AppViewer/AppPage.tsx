import React, { useEffect } from "react";
import styled from "styled-components";
import { WidgetProps } from "widgets/BaseWidget";
import { RenderModes } from "constants/WidgetConstants";
import WidgetFactory from "utils/WidgetFactory";
import { ContainerWidgetProps } from "widgets/ContainerWidget";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { useWindowSizeHooks } from "utils/hooks/dragResizeHooks";
import { useSelector } from "store";
import { AppState } from "reducers";
import { getWidget } from "sagas/selectors";
import { useDispatch } from "react-redux";
import { updateWidget } from "actions/pageActions";
import { theme } from "constants/DefaultTheme";

const PageView = styled.div<{ width: number }>`
  height: 100%;
  position: relative;
  width: ${(props) => props.width}px;
  margin: 0 auto;
`;

type AppPageProps = {
  dsl: ContainerWidgetProps<WidgetProps>;
  pageName?: string;
  pageId?: string;
  appName?: string;
};

export const AppPage = (props: AppPageProps) => {
  const { width } = useWindowSizeHooks();
  const mainContainer = useSelector((state: AppState) => getWidget(state, "0"));
  const dispatch = useDispatch();

  useEffect(() => {
    const layoutType = localStorage.getItem("LAYOUT");

    if (layoutType === "fluid") {
      const { leftColumn, topRow, bottomRow } = mainContainer;
      dispatch(
        updateWidget("RESIZE", "0", {
          rightColumn: width - parseInt(theme.sidebarWidth),
          leftColumn,
          topRow,
          bottomRow,
        }),
      );
    }
  }, [width]);
  useEffect(() => {
    AnalyticsUtil.logEvent("PAGE_LOAD", {
      pageName: props.pageName,
      pageId: props.pageId,
      appName: props.appName,
      mode: "VIEW",
    });
  }, [props.pageId, props.pageName]);
  return (
    <PageView width={props.dsl.rightColumn}>
      {props.dsl.widgetId &&
        WidgetFactory.createWidget(props.dsl, RenderModes.PAGE)}
    </PageView>
  );
};

export default AppPage;
