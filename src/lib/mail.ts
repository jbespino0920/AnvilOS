/*
App Name: CWL Hardware
App Client: CWL Hardware
Author: James Bryant D. Espino
URL: https://github.com/Jamespino20
Last Update Date: July 11, 2026
*/

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const recipients = Array.isArray(to) ? to : [to];
  const uniqueRecipients = [...new Set(recipients.filter(Boolean))];

  if (uniqueRecipients.length === 0) return;

  const from =
    process.env.SMTP_FROM || "CWL Hardware <noreply@cwlhardware.com>";

  // Single SMTP send for all recipients (BCC) so Hostinger's outbound
  // rate limit counts one message instead of one per recipient.
  try {
    if (uniqueRecipients.length === 1) {
      await transporter.sendMail({
        from,
        to: uniqueRecipients[0],
        subject,
        html,
      });
    } else {
      await transporter.sendMail({
        from,
        to: uniqueRecipients[0],
        bcc: uniqueRecipients.slice(1),
        subject,
        html,
      });
    }
  } catch (error) {
    console.error(
      `Failed to send email to ${uniqueRecipients.join(", ")}:`,
      error,
    );
  }
}
