import Chat from "../models/Chat.model.js";

// API to create new chat
const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      userName: req.user.name,
      name: "New Chat",
    };

    const chat = await Chat.create(chatData);
    return res
      .status(200)
      .json({ message: "New Chat created succesfully", chat });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    return res.status(200).json({ suceess: true, chats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    await Chat.deleteOne({ _id: chatId, userId });

    return res.status(200).json({ suceess: true, message: "Chat deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { createChat, getAllChats, deleteChat };
