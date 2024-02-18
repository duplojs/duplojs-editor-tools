import {zod} from "@duplojs/duplojs";
import {workerTesting} from "@duplojs/worker-testing";

export default workerTesting(
	__dirname + "/route.ts",
	[
		{
			title: "insert",
			url: "http://localhost:1506/test/1",
			method: "GET",
			output: [
				"first line !",
				"first line first try!",
				"first line first try double!"
			],
			response: {
				code: 200,
				info: "s",
			}
		},
		{
			title: "double insert",
			url: "http://localhost:1506/test/2",
			method: "GET",
			output: [
				"first line !", 
				"double first",
				"first line first try!",
				"first line first try double!"
			],
			response: {
				code: 200,
				info: "s",
			}
		},
		{
			title: "insert try catch",
			url: "http://localhost:1506/test/3",
			method: "GET",
			response: {
				code: 500,
				info: "error",
				body: zod.literal("this is a super error")
			}
		},
		{
			title: "insert cut step",
			url: "http://localhost:1506/test/4",
			method: "GET",
			output: ["cut step"],
			response: {
				code: 200,
				info: "s"
			}
		},
	]
);
