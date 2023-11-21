import { emailAdapter } from "../adapter/email-adapter"

class EmailManager {
	async sendEamilConfirmationMessage(email: string, code: string): Promise<void> {
		const result = await emailAdapter.sendEmail(email, code)
		return result
	}
	async sendEamilRecoveryCode(email: string, recoveryCode: string) {
		const result = await emailAdapter.sendEmailByRecoveryCode(email, recoveryCode)
		return result
	}
}

export const emailManager = new EmailManager()