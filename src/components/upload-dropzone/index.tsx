"use client";

import UploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { useState, useRef } from "react";

type UploadDropzoneProps = {
  onFilesChange?: (files: File[]) => void;
  accept?: string[];          // ["image/png","image/jpeg","image/gif"]
  maxSizeMB?: number;         // 10
  multiple?: boolean;         // true
  title?: string;             // "הוסף תמונות"
  fileList?: string[];
  handleFileUpload?: (file: string) => void;
};

const acceptedFileTypes: string[] = ["image/png", "image/jpeg", "image/gif"];
const inputTitle: string = "גרור תמונה לכאן או לחץ לבחירה";

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFilesChange, accept = acceptedFileTypes, maxSizeMB = 10, multiple, title, fileList, handleFileUpload }) => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const maxBytes = maxSizeMB * 1024 * 1024;
  const openPicker = () => inputRef.current?.click();

  const validate = (f: File) =>
    accept.includes(f.type) && f.size <= maxBytes;

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).filter(validate);
    if (next.length === 0) return;
    const merged = multiple ? [...files, ...next] : [next[0]];
    setFiles(merged);
    onFilesChange?.(merged);
  };

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onFilesChange?.(next);
  };

  // Drag handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Typography>{title}</Typography>
      <Box
        onClick={openPicker}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPicker()}
        sx={{
          border: "2px dashed",
          borderColor: isDragging ? "primary.main" : "divider",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          outline: "none",
          transition: "border-color .15s ease",
          bgcolor: isDragging ? theme.palette.action.hover : "transparent",
        }}
      >
        <Stack alignItems="center" spacing={1}>
          <UploadIcon fontSize="large" />
          <Typography>
            {inputTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            PNG, JPG, GIF עד {maxSizeMB}MB
          </Typography>
        </Stack>

        {/* hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(",")}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </Box>

      {/* Thumbnails (קטנות), עם אפשרות למחיקה */}
      {files.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 90px)",
            gap: 1.5,
            mt: 1,
          }}
        >
          {files.map((file, i) => {
            const url = URL.createObjectURL(file);
            return (
              <Box
                key={i}
                sx={{
                  position: "relative",
                  width: 90,
                  height: 70,
                  borderRadius: 1,
                  overflow: "hidden",
                  bgcolor: "#f5f7fa",
                }}
              >
                <img
                  src={url}
                  alt={file.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onLoad={() => URL.revokeObjectURL(url)}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  sx={{
                    position: "absolute",
                    top: 2,
                    left: 2,
                    bgcolor: "rgba(0,0,0,.45)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,.6)" },
                  }}
                  aria-label="הסר תמונה"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
