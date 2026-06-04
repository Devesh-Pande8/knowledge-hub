"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";

type KnowledgeFormType = {
  title: string;
  content: string;
  tags: string;
  fileUrl: string;
  fileName?: string;
};

type KnowledgeFormProps = {
  form: KnowledgeFormType;
  formMode: "create" | "edit";
  onChange: (key: keyof KnowledgeFormType, value: string) => void;
  onSave: () => void;
  onReset: () => void;
  onFileUpload: (file: File) => void;
  loading: boolean;
};

export default function KnowledgeForm({
  form,
  formMode,
  onChange,
  onSave,
  onReset,
  onFileUpload,
  loading,
}: KnowledgeFormProps) {
  return (
    <Card sx={{ p: 2 }} elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {formMode === "create"
            ? "Create Knowledge Item"
            : "Edit Knowledge Item"}
        </Typography>
        <Stack spacing={3}>
          <TextField
            label="Title"
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Content"
            value={form.content}
            onChange={(event) => onChange("content", event.target.value)}
            fullWidth
            multiline
            minRows={5}
            disabled={loading}
          />
          <TextField
            label="Tags"
            value={form.tags}
            onChange={(event) => onChange("tags", event.target.value)}
            helperText="Comma-separated tags"
            fullWidth
            disabled={loading}
          />
          <Box>
            <Button variant="contained" component="label" disabled={loading}>
              Upload File
              <input
                type="file"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    onChange("fileName", file.name);
                    onFileUpload(file);
                  }
                }}
              />
            </Button>

            {(form.fileName || form.fileUrl) && (
              <Paper
                variant="outlined"
                sx={{
                  mt: 2,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 2,
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <InsertDriveFileIcon color="primary" />

                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {form.fileName ||
                        decodeURIComponent(form.fileUrl.split("/").pop() || "")}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {form.fileUrl
                        ? "File attached successfully"
                        : "Uploading..."}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  {form.fileUrl && (
                    <IconButton
                      component="a"
                      href={form.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DownloadIcon />
                    </IconButton>
                  )}

                  <IconButton
                    onClick={() => {
                      onChange("fileUrl", "");
                      onChange("fileName", "");
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </Paper>
            )}
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={onSave} disabled={loading}>
              {formMode === "create" ? "Create" : "Save"}
            </Button>
            <Button variant="outlined" onClick={onReset} disabled={loading}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
