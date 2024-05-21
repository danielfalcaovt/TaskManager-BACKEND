export interface emailType {
  to: string
  from: string
  subject: string
  text: string
}

export interface emailSender {
  sendEmail: (email: emailType) => Promise<string>
}
