/* eslint-disable @typescript-eslint/return-await */
import type { emailSender, emailType } from './email-sender-protocols'
import sgMail from '@sendgrid/mail'

export class EmailSender implements emailSender {
  async sendEmail (email: emailType): Promise<string> {
    sgMail.setApiKey(process.env.SENDGRID_APIKEY)
    await sgMail.send(email)
    return new Promise((resolve) => {
      resolve('email sent!')
    })
  }
}
