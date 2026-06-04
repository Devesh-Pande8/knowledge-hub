"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type FiltersPanelProps = {
  search: string;
  tagFilter: string;
  onSearchChange: (value: string) => void;
  onTagChange: (value: string) => void;
};

export default function FiltersPanel({
  search,
  tagFilter,
  onSearchChange,
  onTagChange,
}: FiltersPanelProps) {
  return (
    <Paper sx={{ p: 3 }} elevation={2}>
      <Stack spacing={3}>
        <Typography variant="h6" fontWeight={700}>
          Filters
        </Typography>
        <TextField
          label="Search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          fullWidth
        />
        {/* <FormControl fullWidth>
          <InputLabel id="visibility-label">Visibility</InputLabel>
          <Select
            labelId="visibility-label"
            label="Visibility"
            value={visibility}
            onChange={(event: SelectChangeEvent) =>
              onVisibilityChange(event.target.value as "ALL" | "PRIVATE" | "TEAM")
            }
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PRIVATE">Private</MenuItem>
            <MenuItem value="TEAM">Team</MenuItem>
          </Select>
        </FormControl> */}
        <TextField
          label="Tag"
          value={tagFilter}
          onChange={(event) => onTagChange(event.target.value)}
          fullWidth
        />
      </Stack>
    </Paper>
  );
}
