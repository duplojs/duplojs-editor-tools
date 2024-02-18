import Duplo from "@duplojs/duplojs";
import {parentPort} from "worker_threads";
import {duploExtends, duploFindManyDesc, duploInject} from "../../scripts/index";

const duplo = Duplo({port: 1506, host: "localhost", environment: "DEV"});

duplo.addHook("onDeclareRoute", (route) => {
	duploExtends(route, {
		parentPort
	});

	duploInject(route, ({code, tryCatch}) => {
		if(duploFindManyDesc(route, v => v === "log", "handler")){
			code("first_line", /* js */`
				this.extensions.parentPort?.postMessage("first line !");
			`);

			code("first_line_first_try", /* js */`
				this.extensions.parentPort?.postMessage("first line first try!");
			`);

			code("first_line_first_try", /* js */`
				this.extensions.parentPort?.postMessage("first line first try double!");
			`);
		}

		if(duploFindManyDesc(route, v => v === "first")){
			code("first_line", /* js */`
				this.extensions.parentPort?.postMessage("double first");
			`);
		}

		if(duploFindManyDesc(route, v => v === "cut")){
			code("before_step_[0]", /* js */`
				this.extensions.parentPort?.postMessage("cut step");
			`);
		}

		if(duploFindManyDesc(route, v => v === "try")){
			tryCatch(
				"before_handler",
				"before_no_respose_sent", 
				/* js */`
					response.code(500).info("error").send("this is a super error")
				`
			);
		}
	});
});

duplo.declareRoute("GET", "/test/1")
.handler(({}, res) => res.code(200).info("s").send(), "log");

duplo.declareRoute("GET", "/test/2", "first")
.handler(({}, res) => res.code(200).info("s").send(), "log");

duplo.declareRoute("GET", "/test/3", "try")
.handler(({}, res) => {
	throw new Error();
});

duplo.declareRoute("GET", "/test/4")
.cut(() => {}, undefined, "cut")
.handler(({}, res) => {
	res.code(200).info("s").send();
});

duplo.launch(() => parentPort?.postMessage("ready"));
