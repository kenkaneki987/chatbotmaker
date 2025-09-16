import { promises as fs } from "fs";
import dbAddress from "@/db";
import path from "path";

export const getData = async (filePath) => {
  const data = (await fs.readFile(filePath, "utf-8")) || "[]";
  return JSON.parse(data);
};
export const postData = async (filePath, entry) => {
  const data = await getData(filePath);
  data.push(entry);
  return await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

export const putData = async (filePath, data) => {
  return await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

export const verifyToken = async (token) => {
  const file = path.join(dbAddress, "tokenRegistry.json");
  const tokens = await getData(file);
  return tokens.includes(token);
};

export const registerToken = async (email) => {
  const token = new Date().toISOString() + "#@#" + email;
  const file = path.join(dbAddress, "tokenRegistry.json");
  await postData(file, token);
  return token;
};
export const createChatbot = async ({ name, context, email }) => {
  const filePath = path.join(dbAddress, "chatbots.json");
  const data = await getData(filePath);

  const newChatbot = {
    name,
    context,
    creator: email,
  };

  const newData = [...data, newChatbot];

  await putData(filePath, newData);
};

export const getChatbotByCreator = async (email) => {
  const filePath = path.join(dbAddress, "chatbots.json");
  const data = await getData(filePath);

  return data.filter((chatbot) => chatbot.creator === email);
};

export const getAllChatBots = async () => {
  const filePath = path.join(dbAddress, "chatbots.json");
  const data = await getData(filePath);
  return data;
};

export const getChatbotByName = async (name) => {
  const filePath = path.join(dbAddress, "chatbots.json");
  const data = await getData(filePath);
  return data.find((chatbot) => chatbot.name === name);
};

// Messages persistence
// Schema: { id, chatbotName, userEmail, role: "user"|"bot", text, createdAt }
const messagesFile = () => path.join(dbAddress, "messages.json");

export const getMessages = async ({ chatbotName, userEmail }) => {
  const data = await getData(messagesFile());
  return data.filter(
    (m) => m.chatbotName === chatbotName && m.userEmail === userEmail
  );
};

export const addMessage = async ({ chatbotName, userEmail, role, text }) => {
  const filePath = messagesFile();
  const data = await getData(filePath);
  const entry = {
    id: Date.now(),
    chatbotName,
    userEmail,
    role,
    text,
    createdAt: new Date().toISOString(),
  };
  data.push(entry);
  await putData(filePath, data);
  return entry;
};
