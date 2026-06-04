"use client";

import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

type ConversationItem = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

type ConversationHistoryProps = {
  conversations: ConversationItem[];
};

export default function ConversationHistory({ conversations }: ConversationHistoryProps) {
  return (
    <Card sx={{ p: 2 }} elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Conversation History
        </Typography>
        {conversations.length === 0 ? (
          <Typography color="text.secondary">No conversations yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {conversations.map((conversation) => (
              <Box key={conversation.id} sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {new Date(conversation.createdAt).toLocaleString()}
                </Typography>
                <Typography sx={{ mt: 1 }} fontWeight={700}>
                  Q: {conversation.question}
                </Typography>
                <Typography sx={{ mt: 1, whiteSpace: "pre-line" }}>A: {conversation.answer}</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
