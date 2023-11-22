import { authContorller } from "../Compositions-root/auth-composition-root";
import { authRouter } from "../Controllers/auth-controller";
import { authValidationInfoMiddleware } from "../middleware/authValidationInfoMiddleware";
import { checkRefreshTokenSecurityDeviceMiddleware } from "../middleware/checkRefreshTokenSevurityDevice-middleware";
import { inputValueCodeAuth, inputValueEmailAuth, inputValueEmailAuthPasswordRecovery, inputValueEmailRegistrationAuth, inputValueLoginAuth, inputValueLoginOrEamilAuth, inputValueNewPasswordAuth, inputValuePasswordAuth, inputValueRecoveryCodeAuth } from "../middleware/input-value-auth-middleware";
import { limitRequestMiddleware, limitRequestMiddlewarePassword } from "../middleware/limitRequest";
import { ValueMiddleware } from "../middleware/validatorMiddleware";

authRouter.post(
	"/new-password",
	limitRequestMiddlewarePassword,
	inputValueNewPasswordAuth,
	inputValueRecoveryCodeAuth,
	ValueMiddleware,
	authContorller.createNewPassword.bind(authContorller.createNewPassword)
  );
  
  authRouter.post(
	"/password-recovery",
	limitRequestMiddlewarePassword,
	inputValueEmailAuthPasswordRecovery,
	ValueMiddleware,
	authContorller.createPasswordRecovery.bind(authContorller.createPasswordRecovery)
  );
  
  authRouter.post(
	"/login",
	limitRequestMiddleware,
	inputValueLoginOrEamilAuth,
	inputValuePasswordAuth,
	ValueMiddleware,
	authContorller.createLogin.bind(authContorller.createLogin)
  );
  
  authRouter.post(
	"/refresh-token",
	checkRefreshTokenSecurityDeviceMiddleware,
	authContorller.cretaeRefreshToken.bind(authContorller.cretaeRefreshToken)
  );
  
  authRouter.post(
	"/logout",
	checkRefreshTokenSecurityDeviceMiddleware,
	authContorller.cretaeRefreshToken.bind(authContorller.cretaeRefreshToken)
  );
  
  authRouter.get("/me", authValidationInfoMiddleware, authContorller.findMe.bind(authContorller.findMe));
  
  authRouter.post(
	"/registration",
	limitRequestMiddleware,
	inputValueLoginAuth,
	inputValuePasswordAuth,
	inputValueEmailRegistrationAuth,
	ValueMiddleware,
	authContorller.creteRegistration.bind(authContorller.creteRegistration)
  );
  
  authRouter.post(
	"/registration-confirmation",
	limitRequestMiddleware,
	inputValueCodeAuth,
	ValueMiddleware,
	authContorller.createRegistrationConfirmation.bind(authContorller.createRegistrationConfirmation)
  );
  
  authRouter.post(
	"/registration-email-resending",
	limitRequestMiddleware,
	inputValueEmailAuth,
	ValueMiddleware,
	authContorller.createRegistrationEmailResending.bind(authContorller.createRegistrationEmailResending)
  );
  