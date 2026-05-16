import * as React from 'react';
import { Box, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
    searchText: string;
    placeholderText?: string;
    handleSearchTextChange: (value: string) => void;
    disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    searchText,
    placeholderText = "",
    handleSearchTextChange,
    disabled = false,
}) => {
    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            gap: 1,
            opacity: disabled ? 0.45 : 1,
            pointerEvents: disabled ? "none" : "auto",
            transition: "opacity 0.2s",
        }}>
            <SearchIcon sx={{ color: disabled ? "text.disabled" : "action.active", ml: 1 }} />
            <InputBase
                value={searchText}
                onChange={(e) => handleSearchTextChange(e.target.value)}
                placeholder={searchText === "" ? placeholderText : ""}
                inputProps={{ "aria-label": "search" }}
                disabled={disabled}
                sx={{ width: "100%" }}
            />
            {searchText && !disabled && (
                <Box
                    onClick={() => handleSearchTextChange("")}
                    sx={{
                        cursor: "pointer",
                        color: "text.secondary",
                        fontSize: "0.9rem",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        "&:hover": {
                            bgcolor: "grey.100"
                        }
                    }}
                >
                    נקה
                </Box>
            )}
        </Box>
    );
}
