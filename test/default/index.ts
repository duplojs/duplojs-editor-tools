import {workerTesting} from "@duplojs/worker-testing";

export default workerTesting(
	__dirname + "/route.ts",
	[
		{
			title: "insert",
			url: "http://localhost:1506/test/1",
			method: "GET",
			output: ["first line !", "first line first try!"],
			response: {
				code: 200,
				info: "s",
			}
		},

		{
			title: "double insert",
			url: "http://localhost:1506/test/2",
			method: "GET",
			output: ["first line !", "double first", "first line first try!"],
			response: {
				code: 200,
				info: "s",
			}
		},
	]
);
