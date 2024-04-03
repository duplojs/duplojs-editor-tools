import {existsSync, mkdirSync} from "fs";
import {resolve} from "path";

export class CacheFolder{
	private static readonly mainCacheFolderName = ".duplojs";
	private static nodeModulesPath?: string;

	readonly path: string;

	constructor(name: string){
		this.path = resolve(CacheFolder.getNodeModulesPath(), CacheFolder.mainCacheFolderName, name);
	}

	init(){
		mkdirSync(this.path, {recursive: true});

		return this;
	}

	static create(name: string){
		return new CacheFolder(name).init().path;
	}

	private static getNodeModulesPath(){
		return this.nodeModulesPath 
			|| (
				this.nodeModulesPath = (
					function findNodeModulesPath(path: string): string
					{
						const currentPath = resolve(path, "node_modules");
			
						if(existsSync(currentPath)){
							return currentPath;
						}
						if(path === "/"){
							throw new Error("@duplojs/editor-tools: node_modules folder not found");
						}
						else {
							return findNodeModulesPath(resolve(path, ".."));
						}
					}
				)(process.cwd())
			);
	}
}
