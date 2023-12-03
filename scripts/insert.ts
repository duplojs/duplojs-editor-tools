export interface Inserting{
    (name: "first_line", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "before_hook_on_construct_request", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_hook_on_construct_request", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "before_hook_on_construct_response", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_hook_on_construct_response", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "first_line_first_try", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "first_line_first_catch", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "first_line_second_try", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "first_line_second_catch", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "before_hook_before_route_execution", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_hook_before_route_execution", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "after_make_floor", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "before_handler", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "before_no_respose_sent", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "before_hook_on_error", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_hook_on_error", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "before_hook_before_send", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_hook_before_send", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "before_hook_after_send", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_hook_after_send", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "before_abstract_route", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_abstract_route", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_drop_abstract_route", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "before_hook_before_parsing_body", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_hook_before_parsing_body", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_parsing_body", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "before_extracted", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "first_line_extracted_try", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "first_line_extracted_catch", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_extracted", code: string, arg1?: unknown, arg2?: unknown): void;

    (name: "before_extracted_step", type: string, key: string | null, code: string): void;
    (name: "after_extracted_step", type: string, key: string | null, code: string): void;

    (name: "before_step", index: number, code: string, arg1?: unknown): void;
    (name: "after_step", index: number, code: string, arg1?: unknown): void;
    (name: "after_drop_step", index: number, code: string, arg1?: unknown): void;
    (name: "before_skip_step", index: number, code: string, arg1?: unknown): void;

    (name: "before_exit", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "first_line_exit_try", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "first_line_exit_catch", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "after_exit", code: string, arg1?: unknown, arg2?: unknown): void;
    (name: "before_return", code: string, arg1?: unknown, arg2?: unknown): void;

	(name: "merge_before_abstract_route", index: number, code: string, arg1?: unknown): void;
    (name: "merge_after_abstract_route", index: number, code: string, arg1?: unknown): void;
    (name: "merge_after_drop_abstract_route", index: number, code: string, arg1?: unknown): void;
}

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

export const injectors = {
	default: inject,

	before_extracted_step: (
		stringFunction: string, 
		name: string, 
		type: string, 
		key: string | null, 
		code: string
	) => injectors.default(stringFunction, `${name}_[${type}]` + key ? `_[${key}]` : "", code),
	get after_extracted_step(){
		return injectors.before_extracted_step;
	},

	before_step: (
		stringFunction: string, 
		name: string, 
		index: number, 
		code: string
	) => injectors.default(stringFunction, `${name}_[${index}]`, code),
	get after_step(){
		return injectors.before_step;
	},
	get after_drop_step(){
		return injectors.before_step;
	},
	get before_skip_step(){
		return injectors.before_step;
	},

	merge_before_abstract_route: (
		stringFunction: string, 
		name: string, 
		index: number, 
		code: string
	) => injectors.default(stringFunction, `${name.replace("merge_", "")}_[${index}]`, code),
	get merge_after_abstract_route(){
		return injectors.merge_before_abstract_route;
	},
	get merge_after_drop_abstract_route(){
		return injectors.merge_before_abstract_route;
	},
};

export type BlockNames = "first_line" |

	"before_hook_on_construct_request" |
	"after_hook_on_construct_request" |

	"before_hook_on_construct_response" |
	"after_hook_on_construct_response" |

	"first_line_first_try" |
	"first_line_first_catch" |

	"first_line_second_try" |
	"first_line_second_catch" |

	"before_hook_before_route_execution" |
	"after_hook_before_route_execution" |

	"after_make_floor" |
	"before_handler" |
	"before_no_respose_sent" |

	"before_hook_on_error" |
	"after_hook_on_error" |

	"before_hook_before_send" |
	"after_hook_before_send" |

	"before_hook_after_send" |
	"after_hook_after_send" |

	"before_abstract_route" |
	"after_abstract_route" |
	"after_drop_abstract_route" |

	"before_hook_before_parsing_body" |
	"after_hook_before_parsing_body" |
	"after_parsing_body" |

	"before_extracted" |
	"first_line_extracted_try" |
	"first_line_extracted_catch" |
	"after_extracted" |

	"before_extracted_step" |
	"after_extracted_step" |

	"before_step" |
	"after_step" |
	"after_drop_step" |
	"before_skip_step" |

	"before_exit" |
	"first_line_exit_try" |
	"first_line_exit_catch" |
	"after_exit" |
	"before_return" |

	"merge_before_abstract_route" |
	"merge_after_abstract_route" |
	"merge_after_drop_abstract_route";
