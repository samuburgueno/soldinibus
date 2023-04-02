import { User } from "@/models/user";

// https://blog.devgenius.io/write-a-simple-telegram-bot-in-next-js-b49379e77163

export default async function handler(req, res) {
  // El usuario se registro en el bot
  if (req.body.message?.text === "/start") {
    await User.registerUser(req.body.message.from);
  }

  // Notificar a todos los usuarios registrados en el bot
  if (req.body.message?.text === "/test") {
    await User.notify();
  }

  // El usuario se retiro del bot
  if (req.body.my_chat_member?.new_chat_member?.status === "kicked") {
    await User.deleteUser(req.body.my_chat_member.from.username);
  }

  res.status(200).send("OK");
}
