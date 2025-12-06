import * as React from 'react';
import { Box, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Dispatch, SetStateAction } from 'react';

interface SearchBarProps {
    searchText: string;
    placeholderText?: string;
    handleSearchTextChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchText, placeholderText = "", handleSearchTextChange }) => {
    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            gap: 1,
        }}>
            <SearchIcon sx={{ color: "action.active", ml: 1 }} />
            <InputBase
                value={searchText}
                onChange={(e) => handleSearchTextChange(e.target.value)}
                placeholder={searchText === "" ? placeholderText : ""}
                inputProps={{ "aria-label": "search" }}
                sx={{ width: "100%" }}
            />
            {searchText && (
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
