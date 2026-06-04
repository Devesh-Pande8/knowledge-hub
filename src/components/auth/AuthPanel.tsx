"use client";

import {
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type AuthForm = {
  name: string;
  email: string;
  password: string;
};

type AuthPanelProps = {
  mode: "login" | "register";
  authForm: AuthForm;
  onChange: (key: keyof AuthForm, value: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
  loading: boolean;
  error: string;
};

export default function AuthPanel({
  mode,
  authForm,
  onChange,
  onSubmit,
  onToggleMode,
  loading,
  error,
}: AuthPanelProps) {

  const isSubmitDisabled =
  !authForm.email.trim() ||
  !authForm.password.trim() ||
  (mode === "register" && !authForm.name.trim());
  
  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3, bgcolor: "background.default" }}
    >
      <Paper sx={{ width: "100%", maxWidth: 520, p: 4 }} elevation={3}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Knowledge Hub
            </Typography>
            <Typography color="text.secondary">
              {mode === "login"
                ? "Login to manage your knowledge items."
                : "Register to start building your knowledge hub."}
            </Typography>
          </Box>

          {mode === "register" && (
            <TextField
              label="Name"
              value={authForm.name}
              onChange={(event) => onChange("name", event.target.value)}
              fullWidth
              disabled={loading}
              autoComplete="name"
            />
          )}

          <TextField
            label="Email"
            type="email"
            value={authForm.email}
            onChange={(event) => onChange("email", event.target.value)}
            fullWidth
            disabled={loading}
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={authForm.password}
            onChange={(event) => onChange("password", event.target.value)}
            fullWidth
            disabled={loading}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
          />

          {error ? (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          ) : null}

          <Button type="submit" variant="contained" size="large" disabled={loading || isSubmitDisabled}>
            {mode === "login" ? "Login" : "Register"}
          </Button>

          <Button type="button" color="inherit" onClick={onToggleMode} disabled={loading}>
            {mode === "login"
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
