const nodemailer = require("nodemailer");

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const user = process.env.MAIL_USER;
  // Gmail App Password "abcd efgh ijkl mnop" formatida ko'rsatadi — bo'shliqlar muhim emas
  const pass = (process.env.MAIL_PASS || "").replace(/\s+/g, "");

  if (!user || !pass) {
    throw new Error("MAIL_USER yoki MAIL_PASS .env faylida sozlanmagan");
  }

  cachedTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS — Gmail 587 da TLS upgrade ishlatadi
    requireTLS: true,
    auth: { user, pass },
    // Windows/IPv6 muammosini hal qilish — Gmail IPv4 orqali ulanish
    family: 4,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  return cachedTransporter;
}

async function sendMail({ to, subject, text, html, replyTo }) {
  const transporter = getTransporter();
  const fromName = process.env.MAIL_FROM_NAME || "Vertex Admin";
  const fromAddress = process.env.MAIL_USER;

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject,
    text,
    html,
    replyTo: replyTo || fromAddress,
  });

  return info;
}

module.exports = { sendMail, getTransporter };
