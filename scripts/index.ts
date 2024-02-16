import {Route, Process, AbstractRoute, DescriptionAll, DuploInstance, DuploConfig, Checker, MergeAbstractRoute, Duplose, AbstractRouteUseFunction, AbstractRouteInstance} from "@duplojs/duplojs";
import {BlockName} from "./__types";

export const inject = (stringFunction: string, name: string, code: string) => stringFunction.replace(
	new RegExp(`\\/\\* ${name} \\*\\/([^]*)`),
	(match, g1) => {
		const [block, afterBlock] = g1.split(/\/\* end_block \*\/([^]*)/s);
		return `
            /* first_line */
            ${block}
			${code}
            /* end_block */
            ${afterBlock}
        `;
	}
);

interface InjectObject {
	code(name: BlockName, code: string): void;
	tryCatch(
		nameStart: BlockName, 
		nameEnd: BlockName, 
		code: string
	): void;
}

export function duploInject<
	_duplose extends Route | Process | AbstractRoute | MergeAbstractRoute
>(
	duplose: _duplose, 
	editingFunction: (
		inject: InjectObject,
		object: _duplose,
	) => void,
){
	duplose.editingDuploseFunctions.push(() => {
		editingFunction(
			{
				code(name, code){
					duplose.stringDuploseFunction = inject(
						duplose.stringDuploseFunction,
						name,
						code
					);
				},
				tryCatch(nameStart, nameEnd, code){
					duplose.stringDuploseFunction = inject(
						duplose.stringDuploseFunction,
						nameStart,
						"try{"
					);
					duplose.stringDuploseFunction = inject(
						duplose.stringDuploseFunction,
						nameEnd,
						`}catch(injectError){\n${code}\n}`
					);
				},
			},
			duplose,
		);		
	});
}

export function duploExtends(
	duploses: Route | Process | AbstractRoute | MergeAbstractRoute, 
	extensions: Record<any, any>
){
	Object.entries(extensions).forEach(([key, value]) => {
		duploses.extensions[key] = value;
	});
}

export function duploFindManyDesc(
	duploses: Route | Process | AbstractRoute | MergeAbstractRoute, 
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

export function hasDuplose(
	duplose: Process | Route | AbstractRoute | MergeAbstractRoute,
	searchDuplose: Process | AbstractRoute | Checker | MergeAbstractRoute,
	deep = Infinity
){
	if(deep < 1){
		return false;
	}

	if(duplose instanceof Duplose){
		for(const {parent} of duplose.steps){
			if(
				parent === searchDuplose || (
					parent instanceof Process &&
					hasDuplose(parent, searchDuplose, deep - 1)
				)
			){
				return true;
			}
		}

		if(
			(
				duplose instanceof Route ||
				duplose instanceof AbstractRoute
			) &&
			duplose.subAbstractRoute &&
			(
				duplose.subAbstractRoute.parent === searchDuplose ||
				hasDuplose(duplose.subAbstractRoute.parent, searchDuplose, deep - 1)
			)
		){
			return true;
		}
	}
	else {
		for(const {parent} of duplose.subAbstractRoutes){
			if(
				parent === searchDuplose ||
				hasDuplose(parent, searchDuplose, deep - 1)
			){
				return true;
			}
		}
	}

	return false;
}

interface OnUseDuploseOptions{
    duplose: Process | AbstractRoute | Checker | MergeAbstractRoute,
    handler(route: Process | Route | AbstractRoute| MergeAbstractRoute): void,
	deep?: number,
}

export function onUseDuplose(instance: DuploInstance<DuploConfig>, options?: OnUseDuploseOptions){
	if(!options){
		throw new Error("Function onUseDuplose need options.");
	}

	options.deep = options.deep === undefined ? Infinity : options.deep;

	const handler: OnUseDuploseOptions["handler"] = (duplose) => {
		if(hasDuplose(duplose, options.duplose, options.deep)){
			options.handler(duplose);
		}
	};

	instance.addHook("onDeclareRoute", handler);
	instance.addHook("onCreateProcess", handler);
	instance.addHook("onDeclareAbstractRoute", handler);
}

export function extractAbstractRoute<
	_abstractRouteUseFunction extends AbstractRouteUseFunction<any, any, any, any, any> | AbstractRouteInstance
>(abstractRouteUseFunction: _abstractRouteUseFunction){
	
	return abstractRouteUseFunction instanceof AbstractRouteInstance 
		? abstractRouteUseFunction.subAbstractRoute.parent
		: abstractRouteUseFunction().subAbstractRoute.parent;
}
