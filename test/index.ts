import {workersTesting} from "@duplojs/worker-testing";

workersTesting(
	(path) => import(path),
	__dirname + "/default",
	__dirname + "/hasDuplose",
);
