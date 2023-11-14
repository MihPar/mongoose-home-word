import { UserType, DBUserType } from '../UIRepresentation/types/usersType';
import { emailAdapter } from "../adapter/email-adapter"

export const emailManager = {
	async sendEamilConfirmationMessage(email: string, code: string): Promise<void> {
		const result = await emailAdapter.sendEmail(email, code)
		return result
	}
}