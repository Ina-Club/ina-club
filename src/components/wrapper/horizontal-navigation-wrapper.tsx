import {
  Box,
  CircularProgress,
  TabScrollButton,
  styled,
} from "@mui/material";

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
    loadingMore?: boolean;
    hasMore?: boolean;
}> = ({
    children,
    handleStartScrollClick,
    handleEndScrollClick,
    displayScroll,
    loadingMore = false,
    hasMore = false,
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

            {loadingMore && hasMore ? (
                <CircularProgress size={30} sx={{
                    left: "-20px",
                    zIndex: 2,
                }} />
            ) : <StyledTabScrollButton
                orientation="horizontal"
                direction="left"
                onClick={handleEndScrollClick}
                disabled={!displayScroll.end && !loadingMore}
                sx={{
                    right: "-20px",
                    zIndex: 2,
                }}
            />}
        </Box>
    );

export default HorizontalNavigationWrapper;
