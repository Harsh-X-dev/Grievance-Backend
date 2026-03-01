const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Grievance <onboarding@resend.dev>"; 
// You can later replace with verified domain email

const sendMail = async (to, subject, html) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Resend API key not configured");
    }

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT:", response.data?.id);

    return { success: true };
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return { success: false, message: error.message };
  }
};

const sendResolutionEmail = async (
  studentEmail,
  studentName,
  caseId,
  subject,
  remark
) => {
  const html = `
    <h2>Case Resolved</h2>
    <p>Dear ${studentName},</p>
    <p>Your grievance has been successfully resolved.</p>
    <p><strong>Case ID:</strong> ${caseId}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Resolution Note:</strong> ${
      remark || "Your case has been resolved. Thank you for your patience."
    }</p>
    <p>Thank you for using Grievance.io.</p>
  `;

  return sendMail(
    studentEmail,
    `Case #${caseId} Resolved - Grievance.io`,
    html
  );
};

const sendPasswordResetEmail = async (email, name, otp) => {
  const html = `
    <h2>Password Reset OTP</h2>
    <p>Hello ${name || "User"},</p>
    <h1 style="letter-spacing:5px;">${otp}</h1>
    <p>This OTP is valid for 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  return sendMail(
    email,
    "Password Reset OTP - Grievance.io",
    html
  );
};

module.exports = {
  sendMail,
  sendResolutionEmail,
  sendPasswordResetEmail,
};
