"use client";

import {
  Box,
  TabScrollButton,
  debounce,
  ownerWindow,
  styled,
  useEventCallback,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { cloneElement, useCallback, useEffect, useRef, useState } from "react";

const ResponsiveHorizontalListWrapper: React.FC<{
  children: React.ReactNode;
  gap?: string;
}> = ({ children, gap }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const {
    handleStartScrollClick,
    handleEndScrollClick,
    displayScroll,
    wrapperRef,
    handleTabsScroll,
  } = useHorizontalNavigationWrapper();

  const [itemWidth, setItemWidth] = useState<number>();

  useEffect(() => {
    if (!wrapperRef.current) return;
    const resize = () => {
      setItemWidth(wrapperRef.current!.offsetWidth / 3.7);
    };
    resize();
    const win = ownerWindow(wrapperRef.current);
    win.addEventListener("resize", resize);
    return () => win.removeEventListener("resize", resize);
  }, [wrapperRef]);

  // apply calculated width to children
  const styledChildren = Array.isArray(children)
    ? children.map((child, i) =>
        cloneElement(child as React.ReactElement, {
          key: i,
          style: { ...(child as any).props.style, flex: `0 0 ${itemWidth}px` },
        })
      )
    : children;

  return !isDesktop ? (
    <Box
      ref={wrapperRef}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        width: "100%",
        gap: gap || "10px",
        padding: 1,
        overflowX: "auto", // fixed horizontal scroll for mobile
      }}
    >
      {styledChildren}
    </Box>
  ) : (
    <HorizontalNavigationWrapper
      handleStartScrollClick={handleStartScrollClick}
      handleEndScrollClick={handleEndScrollClick}
      displayScroll={displayScroll}
    >
      <Box
        onScroll={handleTabsScroll}
        ref={wrapperRef}
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-start",
          gap: gap || "10px",
          padding: 1,
          overflow: "hidden",
        }}
      >
        {styledChildren}
      </Box>
    </HorizontalNavigationWrapper>
  );
};

const StyledTabScrollButton = styled(TabScrollButton)(() => ({
  color: "#1a2a5a",
  backgroundColor: "#fff",
  boxShadow: "0px 3px 6px #00000029",
  borderRadius: "20px",
  border: "1px solid #E8E8E8",
  height: "42px",
  width: "42px",
  position: "absolute",
  opacity: 1,
}));

const HorizontalNavigationWrapper: React.FC<{
  children: React.ReactNode;
  handleStartScrollClick: () => void;
  handleEndScrollClick: () => void;
  displayScroll: any;
}> = ({
  children,
  handleStartScrollClick,
  handleEndScrollClick,
  displayScroll,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      height: "100%",
      position: "relative",
    }}
  >
    <StyledTabScrollButton
      orientation="horizontal"
      direction="right"
      onClick={handleStartScrollClick}
      disabled={!displayScroll.start}
      sx={{
        left: "-20px",
        zIndex: 2,
      }}
    />
    {children}
    <StyledTabScrollButton
      orientation="horizontal"
      direction="left"
      onClick={handleEndScrollClick}
      disabled={!displayScroll.end}
      sx={{
        right: "-20px",
        zIndex: 2,
      }}
    />
  </Box>
);

const useHorizontalNavigationWrapper = () => {
  const [displayScroll, setDisplayScroll] = useState({
    start: false,
    end: false,
  });

  const wrapperRef = useRef<HTMLElement>(null);

  const scroll = (scrollValue: any) => {
    animate("scrollLeft", wrapperRef.current, scrollValue);
  };

  const moveTabsScroll = (delta: any) => {
    if (wrapperRef.current == null) return;
    let scrollValue = wrapperRef.current.scrollLeft;

    scrollValue += delta * -1;
    // Fix for Edge
    scrollValue *= 1;

    scroll(scrollValue);
  };

  const handleStartScrollClick = () => {
    if (!wrapperRef || !wrapperRef.current) {
      return;
    }

    moveTabsScroll(-wrapperRef.current.clientWidth);
  };

  const handleEndScrollClick = () => {
    if (!wrapperRef || !wrapperRef.current) {
      return;
    }

    moveTabsScroll(wrapperRef.current.clientWidth);
  };

  const getNormalizedScrollLeft = (element: any) => {
    const { scrollLeft } = element;

    return element.scrollWidth - element.clientWidth + scrollLeft;
  };

  const updateScrollButtonState = useEventCallback(() => {
    if (!wrapperRef || !wrapperRef.current) {
      return;
    }

    const { scrollWidth, clientWidth } = wrapperRef.current;

    const scrollLeft = getNormalizedScrollLeft(wrapperRef.current);
    const showStartScroll = scrollLeft < scrollWidth - clientWidth - 1;
    const showEndScroll = scrollLeft > 1;

    if (
      showStartScroll !== displayScroll.start ||
      showEndScroll !== displayScroll.end
    ) {
      setDisplayScroll({ start: showStartScroll, end: showEndScroll });
    }
  });

  useEffect(() => {
    if (wrapperRef.current == null) return;
    const handleResize = debounce(() => {
      updateScrollButtonState();
    });

    const win = ownerWindow(wrapperRef.current);
    win.addEventListener("resize", handleResize);
    return () => {
      handleResize.clear();
      win.removeEventListener("resize", handleResize);
    };
  }, [updateScrollButtonState]);

  const handleTabsScroll = useCallback(
    debounce(() => updateScrollButtonState()),
    []
  );

  useEffect(() => {
    () => {
      handleTabsScroll.clear();
    };
  }, [handleTabsScroll]);

  useEffect(() => {
    updateScrollButtonState();
  });

  return {
    handleStartScrollClick,
    handleEndScrollClick,
    displayScroll,
    wrapperRef,
    handleTabsScroll,
  };
};

function easeInOutSin(time: number) {
  return (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;
}

function animate(
  property: any,
  element: any,
  to: any,
  options = {},
  cb: any = () => {}
) {
  const {
    ease = easeInOutSin,
    duration = 300, // standard
  }: {
    ease?: any;
    duration?: number;
  } = options;

  let start: any = null;
  const from = element[property];
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
  };

  const step = (timestamp: any) => {
    if (cancelled) {
      cb(new Error("Animation cancelled"));
      return;
    }

    if (start === null) {
      start = timestamp;
    }
    const time = Math.min(1, (timestamp - start) / duration);

    // eslint-disable-next-line no-param-reassign
    element[property] = ease(time) * (to - from) + from;

    if (time >= 1) {
      requestAnimationFrame(() => {
        cb(null);
      });
      return;
    }

    requestAnimationFrame(step);
  };

  if (from === to) {
    cb(new Error("Element already at target position"));
    return cancel;
  }

  requestAnimationFrame(step);
  return cancel;
}

export default ResponsiveHorizontalListWrapper;
