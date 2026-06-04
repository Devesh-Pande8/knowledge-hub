"use client";

import { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  Grid,
  Stack,
  Toolbar,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import AuthPanel from "@/components/auth/AuthPanel";
import FiltersPanel from "@/components/filters/FiltersPanel";
import KnowledgeForm from "@/components/knowledge/KnowledgeForm";
import KnowledgeList from "@/components/knowledge/KnowledgeList";
import AiAssistant from "@/components/ai/AiAssistant";
import ConversationHistory from "@/components/conversations/ConversationHistory";
import { apiCall } from "@/utils/apiClient";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type KnowledgeTag = {
  tag: {
    name: string;
  };
};

type KnowledgeItem = {
  id: string;
  title: string;
  content: string;
  fileUrl?: string | null;
  tags: KnowledgeTag[];
  userId: string;
  createdAt: string;
};

type ConversationItem = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

type KnowledgeListResponse = {
  items: KnowledgeItem[];
  total: number;
  page: number;
  limit: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type KnowledgeFormType = {
  title: string;
  content: string;
  tags: string;
  fileUrl: string;
};

const emptyForm: KnowledgeFormType = {
  title: "",
  content: "",
  tags: "",
  fileUrl: "",
};

const getTagsArray = (tagString: string) =>
  tagString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export default function KnowledgeHub() {
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const TOKEN_STORAGE_KEY = "token";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState<string>("");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  type KnowledgeListItem = Omit<KnowledgeItem, "content" | "userId"> & {
    content?: string;
    fileUrl?: string | null;
    userId?: string;
  };
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState<KnowledgeFormType>({ ...emptyForm });
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    fetchMe();
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchKnowledge();
    }
  }, [user, page, search, tagFilter]);

  useEffect(() => {
    if (selectedItem) {
      fetchConversations(selectedItem.id);
    }
  }, [selectedItem]);

  const fetchMe = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/api/auth/me");
      const result = (await response.json()) as ApiResponse<User>;
      if (!response.ok || !result.success) {
        setToken("");
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setFeedback(result.message);
        return;
      }
      setUser(result.data);
    } catch (error: any) {
      setAuthError(error?.message || "Unable to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const executeAuth = async (url: string, body: {}) => {
    try {
      setLoading(true);
      const response = await apiCall(url, {
        method: "POST",
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Unexpected non-JSON response from server: ${text.slice(0, 200)}`,
        );
      }

      return (await response.json()) as ApiResponse<any>;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setAuthError("");
    try {
      const result = await executeAuth("/api/auth/login", {
        email: authForm.email.trim().toLowerCase(),
        password: authForm.password.trim(),
      });
      if (!result.success) {
        setAuthError(result.message);
        return;
      }
      const token = result.data?.token;
      const userData = result.data?.user;
      if (!token || !userData) {
        setAuthError("Login response is missing authentication data.");
        return;
      }
      setToken(token);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      setUser(userData);
      setAuthForm({ name: "", email: "", password: "" });
      setFeedback("Logged in successfully");
    } catch (error: any) {
      setAuthError(error?.message || "Login failed");
    }
  };

  const handleRegister = async () => {
    setAuthError("");
    try {
      const result = await executeAuth("/api/auth/register", {
        name: authForm.name.trim(),
        email: authForm.email.trim().toLowerCase(),
        password: authForm.password.trim(),
      });
      if (!result.success) {
        setAuthError(result.message);
        return;
      }
      const token = result.data?.token;
      const userData = result.data?.user;
      if (!token || !userData) {
        setAuthError("Registration response is missing authentication data.");
        return;
      }
      setToken(token);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      setUser(userData);
      setAuthForm({ name: "", email: "", password: "" });
      setMode("login");
      setFeedback("Registered and logged in successfully");
    } catch (error: any) {
      setAuthError(error?.message || "Registration failed");
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setItems([]);
    setSelectedItem(null);
    setConversations([]);
    setFeedback("Logged out");
  };

  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      query.set("page", String(page));
      query.set("limit", String(limit));
      if (search) query.set("search", search);
      if (tagFilter) query.set("tag", tagFilter);

      const response = await apiCall(`/api/knowledge?${query.toString()}`);
      const result =
        (await response.json()) as ApiResponse<KnowledgeListResponse>;
      if (!response.ok || !result.success) {
        setFeedback(result.message);
        return;
      }
      setItems(result.data.items);
      setTotal(result.data.total);
      if (!selectedItem && result.data.items.length > 0) {
        setSelectedItem(result.data.items[0]);
      }
    } catch (error: any) {
      setFeedback(error?.message || "Unable to load items");
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async (knowledgeItemId: string) => {
    try {
      const response = await apiCall(
        `/api/conversations?knowledgeItemId=${knowledgeItemId}`,
      );
      const result = (await response.json()) as ApiResponse<ConversationItem[]>;
      if (result.success) {
        setConversations(result.data);
      }
    } catch {
      setFeedback("Unable to load conversation history");
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      setFeedback("Provide title and content first.");
      return;
    }

    const payload = {
      title: form.title,
      content: form.content,
      tags: getTagsArray(form.tags),
      fileUrl: form.fileUrl || undefined,
    };

    try {
      setLoading(true);
      const path =
        formMode === "create" ? "/api/knowledge" : `/api/knowledge/${editId}`;
      const method = formMode === "create" ? "POST" : "PUT";
      const response = await apiCall(path, {
        method,
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ApiResponse<KnowledgeItem>;

      if (!response.ok || !result.success) {
        setFeedback(result.message);
        return;
      }

      setFeedback(result.message);
      setForm({ ...emptyForm });
      setFormMode("create");
      setEditId(null);
      await fetchKnowledge();
    } catch (error: any) {
      setFeedback(error?.message || "Unable to save knowledge item");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: KnowledgeListItem) => {
    setForm({
      title: item.title,
      content: item.content || "",
      tags: item.tags.map((tag) => tag.tag.name).join(", "),
      fileUrl: item.fileUrl || "",
    });
    setFormMode("edit");
    setEditId(item.id);
    setSelectedItem(item as KnowledgeItem);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await apiCall(`/api/knowledge/${deleteId}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as ApiResponse<null>;
      setFeedback(result.message);

      await fetchKnowledge();

      if (selectedItem?.id === deleteId) {
        setSelectedItem(null);
      }
    } catch (error: any) {
      setFeedback(error?.message || "Unable to delete item");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteOpen(false);
    setDeleteId(null);
  };

  const uploadFile = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiCall("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as ApiResponse<any>;
      if (!result.success) {
        setFeedback(result.message);
        return;
      }
      setForm((prev) => ({
        ...prev,
        fileUrl: result.data.secure_url || result.data.url || "",
      }));
      setFeedback("File uploaded successfully");
    } catch (error: any) {
      setFeedback(error?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const askAi = async () => {
    if (!selectedItem) {
      setFeedback("Select a knowledge item first.");
      return;
    }
    if (!chatQuestion.trim()) {
      setFeedback("Ask a question to the AI.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiCall("/api/ai", {
        method: "POST",
        body: JSON.stringify({
          knowledgeItemId: selectedItem.id,
          question: chatQuestion,
        }),
      });
      const result = (await response.json()) as ApiResponse<{ answer: string }>;
      if (!response.ok || !result.success) {
        setFeedback(result.message);
        return;
      }
      setChatAnswer(result.data.answer);
      setChatQuestion("");
      await fetchConversations(selectedItem.id);
    } catch (error: any) {
      setFeedback(error?.message || "AI request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (item: KnowledgeListItem) => {
    setSelectedItem(item as KnowledgeItem);
    setFormMode("edit");
    setEditId(item.id);
    setForm({
      title: item.title,
      content: item.content || "",
      tags: item.tags.map((tag) => tag.tag.name).join(", "),
      fileUrl: item.fileUrl || "",
    });
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isAuthFormValid =
    authForm.email.trim() !== "" &&
    authForm.password.trim() !== "" &&
    (mode === "login" || authForm.name.trim() !== "");

  if (!token || !user) {
    return (
      <AuthPanel
        mode={mode}
        authForm={authForm}
        onChange={(key, value) =>
          setAuthForm((prev) => ({ ...prev, [key]: value }))
        }
        onSubmit={mode === "login" ? handleLogin : handleRegister}
        onToggleMode={() => {
          setMode(mode === "login" ? "register" : "login");
          setAuthError("");
          setAuthForm({ name: "", email: "", password: "" });
        }}
        loading={loading}
        error={authError}
      />
    );
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>
            KNOWLEDGE HUB
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>{user.name}</Typography>
            <Button variant="contained" color="error" onClick={logout}>
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Stack spacing={3}>
          {feedback ? <Alert severity="info">{feedback}</Alert> : null}

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <FiltersPanel
                  search={search}
                  tagFilter={tagFilter}
                  onSearchChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                  onTagChange={(value) => {
                    setTagFilter(value);
                    setPage(1);
                  }}
                />
                <KnowledgeList
                  items={items}
                  selectedItemId={selectedItem?.id ?? null}
                  onSelect={handleSelectItem}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(value) => setPage(value)}
                  loading={loading}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <KnowledgeForm
                  form={form}
                  formMode={formMode}
                  onChange={(key, value) =>
                    setForm((prev) => ({ ...prev, [key]: value }))
                  }
                  onSave={handleSave}
                  onReset={() => {
                    setForm({ ...emptyForm });
                    setFormMode("create");
                    setEditId(null);
                  }}
                  onFileUpload={uploadFile}
                  loading={loading}
                />
                <AiAssistant
                  selectedTitle={selectedItem?.title ?? null}
                  chatQuestion={chatQuestion}
                  chatAnswer={chatAnswer}
                  onQuestionChange={setChatQuestion}
                  onAsk={askAi}
                  loading={loading}
                />
                <ConversationHistory conversations={conversations} />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
      <Dialog open={deleteOpen} onClose={cancelDelete}>
        <DialogTitle>Are you sure you want to delete this item?</DialogTitle>

        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
