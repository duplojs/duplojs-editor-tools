import Duplo from "@duplojs/duplojs";
import {parentPort} from "worker_threads";
import {duploExtends, duploFindManyDesc, duploInjector} from "../../scripts/index";

const duplo = Duplo({port: 1506, host: "localhost"});

duplo.addHook("onDeclareRoute", (route) => {
	duploExtends(route, {
		parentPort
	});

	duploInjector(route, (object, insert) => {
		if(duploFindManyDesc(object, v => v === "log", "handler")){
			insert("first_line", /* js */`
				this.extends.parentPort?.postMessage("first line !");
			`);

			insert("first_line_first_try", /* js */`
				this.extends.parentPort?.postMessage("first line first try!");
			`);
		}

		if(duploFindManyDesc(object, v => v === "first")){
			insert("first_line", /* js */`
				this.extends.parentPort?.postMessage("double first");
			`);
		}
	});
});

duplo.declareRoute("GET", "/test/1")
.handler(({}, res) => res.code(200).info("s").send(), "log");

duplo.declareRoute("GET", "/test/2", "first")
.handler(({}, res) => res.code(200).info("s").send(), "log");

duplo.launch(() => parentPort?.postMessage("ready"));
