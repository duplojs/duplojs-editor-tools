import {readFileSync, writeFileSync} from "fs";
import {resolve} from "path";

const workDir = process.cwd();

const content = readFileSync(resolve(workDir, "node_modules/@duplojs/duplojs/dist/duplo.cjs"), "utf8");

const allName: Record<string, true> = {};

for(const blockName of content.matchAll(/\/\* ([^*]*) \*\//g)){
	if([
		"js", "end_block", "istanbul ignore next", "@__PURE__"
	].includes(blockName[1])){
		continue;
	}

	allName["\"" + blockName[1].replace(/\[\$\{([^}]*)\}\]/g, "[") + "\""] = true;
	if(/\$\{([^}]*)\}/g.test(blockName[1])){
		allName["`" + blockName[1].replace(/\$\{([^}]*)\}/g, "${string}") + "`"] = true;
	}
}

writeFileSync(
	resolve(workDir, "scripts/__types.ts"),
	`
export type BlockName = 
	${Object.keys(allName).sort().join(" |\n\t")};
`
);
