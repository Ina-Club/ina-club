import {
  Box,
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

            {displayScroll.end && !displayScroll.start && <StyledTabScrollButton
                orientation="horizontal"
                direction="left"
                onClick={handleEndScrollClick}
                sx={{
                    right: "-20px",
                    zIndex: 2,
                }}
            />}
        </Box>
    );

export default HorizontalNavigationWrapper;
