# duplojs-editor-tools

## Instalation
```
npm i @duplojs/editor-tools
```

## Utilisation
```ts
import Duplo, {zod} from "@duplojs/duplojs";
import {duploExtend, duploFindManyDesc, duploInjector} from "@duplojs/editor-tools";

const duplo = Duplo({port: 1506, host: "localhost"});

duplo.addHook("onDeclareRoute", (route) => {
    duploExtend(route, {
        log: (...args: any[]) => console.log(...args),
    });

    duploInjector(route, (object, insert) => {
        if(duploFindManyDesc(object, v => v === "log", "handler")){
            insert("first_line", /* js */`
                this.extends.log("first line !");
            `);

            insert("first_line_first_try", /* js */`
                this.extends.log("first line first try!");
            `);
        }

        if(duploFindManyDesc(object, v => v === "first")){
            insert("first_line", /* js */`
                this.extends.log("double first line !");
            `);
        }
    });
});

// declare routes ...

duplo.launch();
```