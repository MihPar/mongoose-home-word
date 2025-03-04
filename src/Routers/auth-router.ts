import { Router } from "express";
import { authContorller } from "../Compositions-root/auth-composition-root";
import { authValidationInfoMiddleware } from "../middleware/authValidationInfoMiddleware";
import { checkRefreshTokenSecurityDeviceMiddleware } from "../middleware/checkRefreshTokenSevurityDevice-middleware";
import { inputValueCodeAuth, inputValueEmailAuth, inputValueEmailAuthPasswordRecovery, inputValueEmailRegistrationAuth, inputValueLoginAuth, inputValueLoginOrEamilAuth, inputValueNewPasswordAuth, inputValuePasswordAuth, inputValueRecoveryCodeAuth } from "../middleware/input-value-auth-middleware";
import { limitRequestMiddleware, limitRequestMiddlewarePassword } from "../middleware/limitRequest";
import { ValueMiddleware } from "../middleware/validatorMiddleware";

export const authRouter = Router({});

authRouter.post(
	"/new-password",
	limitRequestMiddlewarePassword,
	inputValueNewPasswordAuth,
	inputValueRecoveryCodeAuth,
	ValueMiddleware,
	authContorller.createNewPassword.bind(authContorller)
  );
  
  authRouter.post(
	"/password-recovery",
	limitRequestMiddlewarePassword,
	inputValueEmailAuthPasswordRecovery,
	ValueMiddleware,
	authContorller.createPasswordRecovery.bind(authContorller)
  );
  
  authRouter.post(
	"/login",
	limitRequestMiddleware,
	inputValueLoginOrEamilAuth,
	inputValuePasswordAuth,
	ValueMiddleware,
	authContorller.createLogin.bind(authContorller)
  );
  
  authRouter.post(
	"/refresh-token",
	checkRefreshTokenSecurityDeviceMiddleware,
	authContorller.cretaeRefreshToken.bind(authContorller)
  );
  
  authRouter.post(
	"/logout",
	checkRefreshTokenSecurityDeviceMiddleware,
	authContorller.cretaeLogout.bind(authContorller)
  );
  
  authRouter.get("/me", authValidationInfoMiddleware, authContorller.findMe.bind(authContorller));
  
  authRouter.post(
	"/registration",
	limitRequestMiddleware,
	inputValueLoginAuth,
	inputValuePasswordAuth,
	inputValueEmailRegistrationAuth,
	ValueMiddleware,
	authContorller.creteRegistration.bind(authContorller)
  );
  
  authRouter.post(
	"/registration-confirmation",
	limitRequestMiddleware,
	inputValueCodeAuth,
	ValueMiddleware,
	authContorller.createRegistrationConfirmation.bind(authContorller)
  );
  
  authRouter.post(
	"/registration-email-resending",
	limitRequestMiddleware,
	inputValueEmailAuth,
	ValueMiddleware,
	authContorller.createRegistrationEmailResending.bind(authContorller)
  );
  