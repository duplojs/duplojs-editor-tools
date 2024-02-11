import Duplo, {Route} from "@duplojs/duplojs";
import {parentPort} from "worker_threads";
import {extractAbstractRoute, onUseDuplose} from "../../scripts";

const duplo = Duplo({port: 1506, host: "localhost", environment: "DEV"});

const checkerTest = duplo.createChecker("checkerTest").handler(() => ({}) as any).build();

duplo.use(onUseDuplose, {
	duplose: checkerTest,
	handler(duplose){
		parentPort?.postMessage("found checker in duplose " + (duplose instanceof Route ? duplose.paths[0] : duplose.name));
	},
	deep: 2
});

const processTest = duplo.createProcess("processTest")
.check(checkerTest, {input: () => {}, catch: () => {}})
.build();

duplo.use(onUseDuplose, {
	duplose: processTest,
	handler(duplose){
		parentPort?.postMessage("found process in duplose " + (duplose instanceof Route ? duplose.paths[0] : duplose.name));
	},
});

const abstractRouteTest = duplo.declareAbstractRoute("abstractRouteTest")
.process(processTest)
.build();

duplo.use(onUseDuplose, {
	duplose: extractAbstractRoute(abstractRouteTest),
	handler(duplose){
		parentPort?.postMessage("found abstractRoute in duplose " + (duplose instanceof Route ? duplose.paths[0] : duplose.name));
	},
});

const mergeAbstractRouteTest = duplo.mergeAbstractRoute([abstractRouteTest()]);

duplo.use(onUseDuplose, {
	duplose: extractAbstractRoute(mergeAbstractRouteTest),
	handler(duplose){
		parentPort?.postMessage("found mergeAbstractRoute in duplose " + (duplose instanceof Route ? duplose.paths[0] : duplose.name));
	},
});

mergeAbstractRouteTest
.declareRoute("GET", "/test")
.handler(() => {});

duplo.launch(() => parentPort?.postMessage("ready"));
