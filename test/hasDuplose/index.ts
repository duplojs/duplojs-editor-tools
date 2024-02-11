import {zod} from "@duplojs/duplojs";
import {workerTesting} from "@duplojs/worker-testing";

export default workerTesting(
	__dirname + "/route.ts",
	[],
	[
		"found checker in duplose processTest",

		"found checker in duplose abstractRouteTest",
		"found process in duplose abstractRouteTest",

		"found process in duplose @merge(abstractRouteTest)",
		"found abstractRoute in duplose @merge(abstractRouteTest)",
		
		"found process in duplose /test",
		"found abstractRoute in duplose /test",
		"found mergeAbstractRoute in duplose /test"
	]
);
