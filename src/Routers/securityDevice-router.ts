import { securityDeviceRouter } from "../Controllers/securityDevice-controller";
import { checkRefreshTokenSecurityDeviceMiddleware } from "../middleware/checkRefreshTokenSevurityDevice-middleware";
import { checkForbiddenSecurityDevice } from '../middleware/checkForbiddenSecurityDevice';
import { securityDeviceController } from "../Compositions-root/securityDevice-compostition-root";

securityDeviceRouter.get(
	"/",
	checkRefreshTokenSecurityDeviceMiddleware,
	securityDeviceController.getDeviceUsers.bind(securityDeviceController.getDeviceUsers)
  );
  securityDeviceRouter.delete(
	"/",
	checkRefreshTokenSecurityDeviceMiddleware,
	securityDeviceController.terminateCurrentSessions.bind(securityDeviceController.terminateCurrentSessions)
  );
  securityDeviceRouter.delete(
	"/:deviceId",
	checkRefreshTokenSecurityDeviceMiddleware,
	checkForbiddenSecurityDevice,
	securityDeviceController.terminateSessionById.bind(securityDeviceController.terminateSessionById)
  );
  