// import OpenAI from "openai";

// export const getOpenAI = () => {
//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) {
//     throw new Error("Missing OPENAI_API_KEY environment variable");
//   }

//   return new OpenAI({ apiKey });
// };
import OpenAI from "openai";

export const getOpenAI = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
};