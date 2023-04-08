import Telegram from "@/models/telegram";
import { User } from "@/models/user";
import { prisma } from "@/prisma/client";

/**
 * https://blog.devgenius.io/write-a-simple-telegram-bot-in-next-js-b49379e77163
 * https://api.telegram.org/botTOKEN/setWebhook?url=URL/api/webhook/telegram
 */

export default async function handler(req, res) {
  // Log para guardar el request
  await prisma.logger.create({
    data: {
      log: req.body,
    },
  });

  const { message, my_chat_member } = req.body;

  // El usuario se registro en el bot
  if (message && message.text === "/start") {
    await User.registerUser(req.body.message.from, true);
  }

  if (message && message.text === "/horarios") {
    await Telegram.buttons(req.body.message.from);
  }

  // Registro a cualquier usuario que envie un mensaje
  if (message) {
    await User.registerUser(req.body.message.from);
  }

  // Notificar a todos los usuarios registrados en el bot
  // if (message && message.text === "/notify") {
  //   await User.notify();
  // }

  // El usuario se retiro del bot
  if (my_chat_member && my_chat_member.new_chat_member.status === "kicked") {
    // await User.deleteUser(req.body.my_chat_member.from.username);
  }

  res.status(200).send("OK");
}
