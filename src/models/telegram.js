import { prisma } from "@/prisma/client";

const Telegram = {
  async buttons(data) {
    let routes = await prisma.route.findMany({});

    let message = "Selecciona una ruta para ver el horario:";
    let inlineKeyboard = [];

    routes.forEach((route) => {
      inlineKeyboard.push([
        {
          text: route.title,
          url: `${process.env.BASE_URL}/callback/${route.id}`,
        },
      ]);
    });

    const replyMarkup = {
      inline_keyboard: inlineKeyboard,
    };

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: data.id,
            text: message,
            reply_markup: replyMarkup,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error sending message:", errorData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    return message;
  },
};

export default Telegram;
