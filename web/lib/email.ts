import 'server-only';
import nodemailer from 'nodemailer';

const APP = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const FROM = process.env.EMAIL_FROM || 'Amani Tech <no-reply@amanitech.in>';
const ADMIN = process.env.ADMIN_NOTIFICATION_EMAIL;

function transport() {
  if (!process.env.EMAIL_HOST) return null; // email disabled until SMTP is configured
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST, port: Number(process.env.EMAIL_PORT || 587), secure: Number(process.env.EMAIL_PORT) === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  });
}

const layout = (title: string, body: string) => `<!doctype html><html><body style="margin:0;background:#F7F8FA;font-family:Inter,Segoe UI,Arial,sans-serif;color:#151B26">
<div style="max-width:560px;margin:32px auto;background:#fff;border:1px solid #E3E7ED;border-radius:12px;overflow:hidden">
<div style="background:#0B2545;padding:20px 28px;color:#fff;font-weight:800;font-size:18px">Amani<span style="color:#0E9F6E">Tech</span></div>
<div style="padding:28px"><h1 style="font-size:20px;margin:0 0 12px;color:#0B2545">${title}</h1>${body}</div>
<div style="padding:16px 28px;border-top:1px solid #E3E7ED;font-size:12px;color:#5C6675">Amani Tech · Hyderabad · <a href="${APP}" style="color:#13315C">${APP.replace(/^https?:\/\//, '')}</a></div></div></body></html>`;

async function send(to: string, subject: string, html: string) {
  const t = transport();
  if (!t) { console.info(`[email skipped — no SMTP] to=${to} subject="${subject}"`); return; }
  try { await t.sendMail({ from: FROM, to, subject, html }); } catch (e) { console.error('[email] send failed', e); }
}

const p = (s: string) => `<p style="margin:0 0 12px;line-height:1.6">${s}</p>`;
const btn = (href: string, text: string) => `<p style="margin:20px 0 0"><a href="${href}" style="display:inline-block;background:#0E9F6E;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">${text}</a></p>`;

export const email = {
  registrationCompleted: (to: string, name: string, job?: { title: string; company: string }) =>
    send(to, 'Registration completed — Amani Tech', layout('Registration completed',
      p(`Hi ${name},`) + p(`Thank you for registering with Amani Tech. We have received your details${job ? ` and your application for <strong>${job.title}</strong> at ${job.company}` : ''}.`) +
      p('Our recruitment team will review your profile and contact you if there is a suitable match. Job seekers never pay a fee.') + btn(`${APP}/candidate/dashboard`, 'Track your applications') + p('<br>— Team Amani Tech'))),

  applicationNotifyAdmin: (candidate: string, jobTitle: string) =>
    ADMIN ? send(ADMIN, `New application: ${jobTitle}`, layout('New application received', p(`<strong>${candidate}</strong> applied for <strong>${jobTitle}</strong>.`) + btn(`${APP}/admin/applications`, 'Review in admin'))) : Promise.resolve(),

  employerEnquiry: (to: string, name: string, reference: string, sla: string) =>
    send(to, `Requirement received (${reference}) — Amani Tech`, layout('Requirement received',
      p(`Hi ${name},`) + p(`Thank you. A member of our team will contact you ${sla} to discuss next steps.`) + p(`Reference: <strong>${reference}</strong>`) + p('<br>— Team Amani Tech'))),

  employerNotifyAdmin: (company: string, title: string, reference: string) =>
    ADMIN ? send(ADMIN, `New employer requirement: ${company}`, layout('New staffing requirement', p(`<strong>${company}</strong> submitted a requirement for <strong>${title}</strong> (${reference}).`) + btn(`${APP}/admin/employers`, 'Open lead'))) : Promise.resolve(),

  vendorReceived: (to: string, contact: string) =>
    send(to, 'Partner application received — Amani Tech', layout('Application received', p(`Hi ${contact},`) + p('We review partner applications within five business days and will be in touch.') + p('<br>— Team Amani Tech'))),

  contactReceived: (to: string, name: string) =>
    send(to, 'We received your message — Amani Tech', layout('Message received', p(`Hi ${name},`) + p('Thank you for getting in touch. We will reply within one business day.') + p('<br>— Team Amani Tech'))),

  notifyAdmin: (subject: string, body: string, link: string) =>
    ADMIN ? send(ADMIN, subject, layout(subject, p(body) + btn(`${APP}${link}`, 'Open in admin'))) : Promise.resolve(),
};
