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
import FileValidationError from "errors/FileValidationError";

interface UploadDropzoneProps {
  handleFileUpload: (file: File[]) => void;
  accept?: string[];          // ["image/png","image/jpeg","image/gif"]
  maxSizeMB?: number;         // 10
  multiple?: boolean;         // true
  title?: string;             // "הוסף תמונות"
};

const acceptedFileTypes: string[] = ["image/png", "image/jpeg", "image/gif"];

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ handleFileUpload, accept = acceptedFileTypes, maxSizeMB = 10, multiple, title }) => {
  const theme = useTheme();
  const maxBytes: number = maxSizeMB * 1024 * 1024;
  const inputRef = useRef<HTMLInputElement>(null);
  const openPicker = () => inputRef.current?.click();
  const [files, setFiles] = useState<File[]>([]);
  const [filesSizeInBytes, setFilesSizeInBytes] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: File[], filesSize: number) => {
    handleFileUpload(files);
    setFiles(files);
    setFilesSizeInBytes(filesSize);
  }

  const validateFiles = (newFiles: File[], newFilesSizeInBytes: number) => {
    // Validate files total size and validate they are supported file types!
    if (multiple && filesSizeInBytes + newFilesSizeInBytes > maxBytes)
      throw new FileValidationError(`Total size of files exceeds ${maxSizeMB}MB`);
    if (!multiple && newFilesSizeInBytes > maxBytes)
      throw new FileValidationError(`File size of exceeds ${maxSizeMB}MB`);
    Array.from(newFiles).filter(validateFile);
  }

  const validateFile = (file: File) => {
    if (!accept.includes(file.type))
      throw new FileValidationError(`File type ${file.type} is not supported`);
  }

  const addFiles = (newFiles: File[]) => {
    const newFilesSizeInBytes: number = Array.from(newFiles).reduce((sizeSum, file) => sizeSum + file.size, 0); // Calculate the size of the new files.
    try {
      validateFiles(newFiles, newFilesSizeInBytes);
      const newFilesList: File[] = multiple ? [...files, ...newFiles] : [newFiles[0]];
      const newFilesSize: number = multiple ? filesSizeInBytes + newFilesSizeInBytes : newFilesSizeInBytes;
      handleFileChange(newFilesList, newFilesSize);
    }
    catch (err) {
      if (err instanceof FileValidationError) {
        alert(err.message);
      } else {
        console.error("Unexpected error while validating files:", err);
      }
    }
  };

  const removeFile = (index: number) => {
    const toBeRemoved: File = files.filter((_, i) => i === index)[0]!;
    const filteredFiles: File[] = files.filter((_, i) => i !== index);
    handleFileChange(filteredFiles, filesSizeInBytes - toBeRemoved.size)
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
    addFiles([...e.dataTransfer.files]);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
          <Typography>{title}</Typography>
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
          onChange={(e) => addFiles(Array.from(e.target.files ?? []))} // if no files are picked, return an empty array
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
