import { useMachine } from "@xstate/react";
import { BSBContext, bsbSearchMachine } from "../machines/BsbSearchMachine";
import { AnyEventObject } from "xstate";
import getBsb from "../api/getBsb";
import { FocusEventHandler, MouseEventHandler } from "react";

interface OnBSBSelected {
    (source: string): void
}
interface BsbSearchParameters {
    id: string,
    autoComplete: string,
    placeholder: string,
    defaultValue: string,
    onBSBSelected: OnBSBSelected
}
function BsbSearch(props: BsbSearchParameters) {

    const [state, send] = useMachine(bsbSearchMachine, {
        services: {
            getBSB: (context: BSBContext, event: AnyEventObject) =>
                new Promise(async (resolve, reject) => {
                    if (!context.bsb || context.bsb.length < 4)
                        reject("No selected payee");
                    let result = await getBsb(context.bsb);
                    if (result.status === 200) {
                        resolve(result.json());
                    } else {
                        reject(result);
                    }
                })
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let str:string = e.target.value||"";
        if (str.length == 6) {
            props.onBSBSelected(e.target.value)
        }
        else if (str.length > 3) {

            send({
                type: 'SEARCH_BSB',
                bsbQuery: e.target.value
            });
        }
    }

    return (
        <div>
            <form>
                <input
                    onChange={handleChange}
                    value={state.context.bsb}
                    type="search" {...props}
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </form>

            {state.matches('list.loading') && (
                <span className="w-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-loader animate-spin text-2xl"
                    >
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                </span>
            )}

            <ul>
                {((!state.context.list || state.context.list.length === 0) ? "" : state.context.list.map(post => {
                    return <li
                        key={post.bsb}
                        onClick={() => props.onBSBSelected(post.bsb)}
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
                        {post.bsbLabel} ({post.name} {post.location})
                    </li>
                }))}
            </ul>
        </div>
    )
}
export default BsbSearch;