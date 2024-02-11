# duplojs-editor-tools
[![NPM version](https://img.shields.io/npm/v/@duplojs/editor-tools)](https://www.npmjs.com/package/@duplojs/editor-tools)

## Instalation
```
npm i @duplojs/editor-tools
```

## Utilisation
```ts
import Duplo, {zod} from "@duplojs/duplojs";
import {duploExtends, duploFindManyDesc, duploInjector} from "@duplojs/editor-tools";

const duplo = Duplo({port: 1506, host: "localhost", environment: "DEV"});

duplo.addHook("onDeclareRoute", (route) => {
    duploExtends(route, {
        log: (...args: any[]) => console.log(...args),
    });

    duploInject(route, ({code}) => {
        if(duploFindManyDesc(object, v => v === "log", "handler")){
            code("first_line", /* js */`
                this.extends.log("first line !");
            `);

            code("first_line_first_try", /* js */`
                this.extends.log("first line first try!");
            `);
        }

        if(duploFindManyDesc(object, v => v === "first")){
            code("first_line", /* js */`
                this.extends.log("double first line !");
            `);
        }
    });
});

// declare routes ...

duplo.launch();
```