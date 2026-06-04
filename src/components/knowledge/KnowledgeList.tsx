"use client";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";

type KnowledgeTag = {
  tag: {
    name: string;
  };
};

type KnowledgeItem = {
  id: string;
  title: string;
  content?: string;
  fileUrl?: string | null;
  tags: KnowledgeTag[];
  userId?: string;
  createdAt: string;
};

type KnowledgeListProps = {
  items: KnowledgeItem[];
  selectedItemId: string | null;
  onSelect: (item: KnowledgeItem) => void;
  onEdit: (item: KnowledgeItem) => void;
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (value: number) => void;
  loading: boolean;
};

export default function KnowledgeList({
  items,
  selectedItemId,
  onSelect,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
  loading,
}: KnowledgeListProps) {
  return (
    <Card sx={{ p: 2 }} elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Knowledge Items
        </Typography>
        <Stack spacing={2}>
          {items.length === 0 ? (
            <Typography color="text.secondary">No items found.</Typography>
          ) : (
            items.map((item) => (
              <Card
                key={item.id}
                variant={selectedItemId === item.id ? "outlined" : undefined}
                sx={{
                  cursor: "pointer",
                  borderColor: selectedItemId === item.id ? "primary.main" : undefined,
                }}
              >
                <CardContent onClick={() => onSelect(item)}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {item.title}
                      </Typography>
                    </Box>
                    <Box>
                      {item.tags.slice(0, 4).map((tag) => (
                        <Chip key={tag.tag.name} label={tag.tag.name} size="small" sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => onEdit(item)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => onDelete(item.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </Stack>
      </CardContent>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          page={page}
          count={totalPages}
          onChange={(_, value) => onPageChange(value)}
          disabled={loading}
          color="primary"
        />
      </Box>
    </Card>
  );
}
