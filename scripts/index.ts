import {AbstractRoute, DescriptionAll, ProcessExport, Route} from "@duplojs/duplojs";
import {injectors, inject} from "./insert";
import type {BlockNames, Inserting} from "./insert";

export {BlockNames, Inserting, inject};

export function duploInjector<
	duploses extends Route | ProcessExport | AbstractRoute
>(
	duploses: duploses, 
	editingFunction: (
		object: duploses,
		insert: Inserting,
	) => void,
	withoutRebuild?: boolean
){
	duploses.editingFunctions.push(object => {
		editingFunction(
			object as duploses,
			(name, ...args) => {
				//@ts-ignore
				object.stringFunction = injectors[name]?.(object.stringFunction, name, ...args) || injectors.default(object.stringFunction, name, ...args);
			}
		);		
	});
	if(withoutRebuild !== true) duploses.build();
}

export function duploExtend(duploses: Route | ProcessExport | AbstractRoute, extend: Record<any, any>){
	Object.entries(extend).forEach(([key, value]) => duploses.extends[key] = value);
}

export function duploFindManyDesc(
	duploses: Route | ProcessExport | AbstractRoute, 
	find: (value: any) => boolean,
	type?: DescriptionAll["type"],
){
	const result: any[] = [];

	duploses.descs.forEach(desc => {
		if(type && desc.type !== type) return;
		desc.descStep.forEach(d => !find(d) || result.push(d));
	});

	return result.length !== 0 ? result : null;
}
