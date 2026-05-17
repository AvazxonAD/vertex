const { MessageDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");
const { HelperFunctions } = require("../../helper/functions");
const { sendMail } = require("../../helper/mailer");

function buildReplyHtml({ name, originalMessage, reply }) {
  const safe = (s) => String(s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
  return `
    <div style="font-family: Arial, sans-serif; color:#222; max-width:640px; margin:0 auto;">
      <h2 style="color:#0f325b;">Vertex Science Publishing House</h2>
      <p>Hello <b>${safe(name)}</b>,</p>
      <p>Reply to your message:</p>
      <div style="border-left:4px solid #0f325b; padding:12px 16px; background:#f6f8fb; margin:12px 0;">
        ${safe(reply)}
      </div>
      <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;"/>
      <p style="color:#666; font-size:13px;"><b>Your original message:</b></p>
      <div style="color:#555; font-size:13px; background:#fafafa; padding:10px 14px; border-radius:6px;">
        ${safe(originalMessage)}
      </div>
      <p style="color:#999; font-size:12px; margin-top:24px;">This message was sent from the Vertex admin panel.</p>
    </div>
  `;
}

class MessageService {
  static async list(page = 1, limit = 10, status) {
    const result = await MessageDB.get(page, limit, status);
    const meta = HelperFunctions.pagination({ page, limit, count: result.countResult });
    return { data: result.data, meta };
  }

  static async getById(id) {
    const message = await MessageDB.getById(id);
    if (!message) throw new ErrorResponse("message.not_found", 404);
    return message;
  }

  static async create(payload) {
    return MessageDB.create(payload);
  }

  static async markRead(id) {
    const existing = await MessageDB.getById(id);
    if (!existing) throw new ErrorResponse("message.not_found", 404);
    return MessageDB.markRead(id);
  }

  static async reply(id, { reply, subject }) {
    const existing = await MessageDB.getById(id);
    if (!existing) throw new ErrorResponse("message.not_found", 404);

    try {
      await sendMail({
        to: existing.email,
        subject: subject || `Re: Your message to Vertex`,
        text: reply,
        html: buildReplyHtml({
          name: existing.name,
          originalMessage: existing.message,
          reply,
        }),
      });
    } catch (err) {
      console.error("Mail yuborishda xatolik:", err.message);
      throw new ErrorResponse(`message.mail_failed: ${err.message}`, 502);
    }

    return MessageDB.setReplied(id, reply);
  }

  static async delete(id) {
    const existing = await MessageDB.getById(id);
    if (!existing) throw new ErrorResponse("message.not_found", 404);
    await MessageDB.delete(id);
    return { id: Number(id) };
  }

  static async stats() {
    return MessageDB.stats();
  }
}

module.exports = { MessageService };
