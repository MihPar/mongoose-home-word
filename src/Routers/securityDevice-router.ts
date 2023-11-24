import { checkRefreshTokenSecurityDeviceMiddleware } from "../middleware/checkRefreshTokenSevurityDevice-middleware";
import { checkForbiddenSecurityDevice } from '../middleware/checkForbiddenSecurityDevice';
import { securityDeviceController } from "../Compositions-root/securityDevice-compostition-root";
import { Router } from "express";

export const securityDeviceRouter = Router({});

securityDeviceRouter.get(
	"/",
	checkRefreshTokenSecurityDeviceMiddleware,
	securityDeviceController.getDeviceUsers.bind(securityDeviceController)
  );
  securityDeviceRouter.delete(
	"/",
	checkRefreshTokenSecurityDeviceMiddleware,
	securityDeviceController.terminateCurrentSessions.bind(securityDeviceController)
  );
  securityDeviceRouter.delete(
	"/:deviceId",
	checkRefreshTokenSecurityDeviceMiddleware,
	checkForbiddenSecurityDevice,
	securityDeviceController.terminateSessionById.bind(securityDeviceController)
  );
  