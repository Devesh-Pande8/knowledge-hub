export const successResponse = (
  data: unknown,
  message = "Success",
  status = 200
) => {
  const payload = JSON.stringify({ success: true, message, data });
  return new Response(payload, {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export const errorResponse = (
  message = "Something went wrong",
  status = 500
) => {
  const payload = JSON.stringify({ success: false, message });
  return new Response(payload, {
    status,
    headers: { "Content-Type": "application/json" },
  });
};