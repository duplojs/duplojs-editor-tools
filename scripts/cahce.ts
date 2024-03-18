import {existsSync} from "fs";
import {resolve} from "path";

export class CacheFolder{
	readonly path: string;

	constructor(name: string){
		this.path = resolve(this.getNodeModulesPath(), this.mainCacheFolderName, name);
	}

	readonly mainCacheFolderName = ".duplojs";
	private nodeModulesPath?: string;
	private getNodeModulesPath(){
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
