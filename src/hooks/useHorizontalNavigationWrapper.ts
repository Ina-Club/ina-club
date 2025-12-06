import { debounce, ownerWindow, useEventCallback } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

function easeInOutSin(time: number) {
  return (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;
}

function animate(
  property: any,
  element: any,
  to: any,
  options = {},
  cb: any = () => { }
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

export default useHorizontalNavigationWrapper;
