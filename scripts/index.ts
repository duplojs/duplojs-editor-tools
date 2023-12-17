import {AbstractRoute, DescriptionAll, ProcessExport, Route} from "@duplojs/duplojs";
import {injectors} from "./insert";
export {inject} from "./insert";
import type {Inserting} from "./insert";
export type {BlockNames, Inserting} from "./insert";


export function duploInjector<
	duploses extends Route | ProcessExport | AbstractRoute
>(
	duploses: duploses, 
	editingFunction: (
		object: duploses,
		insert: Inserting,
	) => void,
	withoutBuild?: boolean
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
	if(withoutBuild !== true) duploses.build();
}

export function duploExtends(duploses: Route | ProcessExport | AbstractRoute, extend: Record<any, any>){
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
