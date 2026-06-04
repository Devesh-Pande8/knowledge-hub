"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type AiAssistantProps = {
  selectedTitle: string | null;
  chatQuestion: string;
  chatAnswer: string;
  onQuestionChange: (value: string) => void;
  onAsk: () => void;
  loading: boolean;
};

export default function AiAssistant({
  selectedTitle,
  chatQuestion,
  chatAnswer,
  onQuestionChange,
  onAsk,
  loading,
}: AiAssistantProps) {
  return (
    <Card sx={{ p: 2 }} elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          AI Assistant
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Ask a question about the selected knowledge item and get a context-aware response.
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Question"
            value={chatQuestion}
            onChange={(event) => onQuestionChange(event.target.value)}
            fullWidth
            multiline
            minRows={3}
            disabled={loading || !selectedTitle}
          />
          <Button variant="contained" onClick={onAsk} disabled={loading || !selectedTitle}>
            Ask AI
          </Button>
          {selectedTitle ? null : (
            <Typography color="text.secondary">Select a knowledge item to ask questions.</Typography>
          )}
          {chatAnswer ? (
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                AI Response
              </Typography>
              <Typography>{chatAnswer}</Typography>
            </Box>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
