import { createContext } from 'react';
import { AnyEventObject, assign, createMachine, send } from 'xstate';
import { pure, raise, sendTo } from 'xstate/lib/actions';
import getBsb from '../api/getBsb';
import { Domestic, PayeeData } from '../types/Payee';
import { initialisePayee } from '../utils/PayeeUtils';

export const MachineContext = createContext<PayeeValidationContext>({
    payee: initialisePayee(),
    errors: [],
});

export interface ValidationErrors {
    id: string;
    text: string;
}

export interface PayeeValidationContext {
    payee: PayeeData;
    errors: ValidationErrors[];
}

const getBSB = (context: PayeeValidationContext, _evt: any) => {
    return new Promise((resolve, reject) => {
        getBsb(context.payee.domestic?.account?.bsb as string).then(result => {
            if (result.status === 200) {
                resolve(result.json());
            } else {
                reject(result);
            }
        });
    });
};

const email_regex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const cc_regex: RegExp =
    /^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;

const luhn_checksum = (code: string) => {
    let len: number = code.length;
    let parity: number = len % 2;
    let sum: number = 0;
    for (var i: number = len - 1; i >= 0; i--) {
        var d: number = parseInt(code.charAt(i));
        if (i % 2 === parity) {
            d *= 2;
        }
        if (d > 9) {
            d -= 9;
        }
        sum += d;
    }
    return sum % 10;
};

export const payeeValidationMachine = createMachine<PayeeValidationContext>(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QDcCGAbAlhVAXTA9gHYB0mRmuAxEWAB64DaADALqKgAOBslhRHEHUQAmZsxIBOAGwAOAOzSAjJPkBmOQBZZIgDQgAnojUmSIyZNlWArGp061AX0f60WHPmIkAxgAsw3gDWkADKuABOAK7euJHhYDT0TGyC3LyeAkhCiNaaSiTqmnki2qqazJr6RghqJQWalvKySrLisiZOLiBu2Hj8Pv5BoRHRsfFUEAQAtnD43izsWWl8xILCCLn5hcWl8uWVhohKzMcFzLWSIrZK8pJqms6uGL0ZAwHBEGFRMXEJAEaYdDoMDhBapHgrTKgdbXAr3HayMoVKpHJT5ZgiDrHEoiXGdJ7uPpePzvYbfMYJci4EFEIm09BgpYQjJrHJqLbwpQlRF7ZGHBBKBrSAqKEqaNSKBT3R7dZ4efqTGawOZkCjUWgMRlcZn8VkIBTyEgnazSS4ieTMayXJQogWWzQkay2MWSFRWfGywmvRWzTDeN5DT4jH7jDXJRba9K6rLrTF2EgS6xKaTnJq1A7VTRyMwiaTivZXZi3GU9eVeH3Kv0Bj5fUa-KicVAGbBakDLFkxo4iG4FZr3c2yaR5+TyW1D2QFawnRFiWwmJQluV0kgVlUkwO1kMJbyocIQVvt6PQrvm3tKftNIeaEe2hQO6-SeTn8XWQfFrql5erqvrmvBilUKg3jeAQkREOG4JRqsnYCrihpNM+A5Xje-LHK0ZjnJiihXhiDwfku3rTL6-qNs2ECqpQiSaikTJQVC2QCk6ahGtIua4iaewWBmiAWpIRriGIkiWqx0i1IuXoKkRlYkU22DVmSdahkkB46tBx4Cu6JD2OaajMO0TrWLavH8RizBCSauZifhEnllJKqkXJv6QAAKgYnDboMgQAPpgFMqCAipdF6nGE6JsmqbtCUtomg6NySAZrpTqasjiS8klKvZsnkU5ECue5VC-l5nC+MQYCBZCwUmKF8hJimEqRdxCDGeIpnmSJJipWWpDfjJZHyblbkJGG5UdupIUJjV4X1emt4VFIc7mrkrG5HhBJpbZGU-ru5HkJRw00ZGFUwUoJrMcwInsY+DSSI1roOvIubqLUb6qJInVfnZW17v1m4AftEZtqp9GxlVE21RFM38kJEhCXmWbnKxmi5O9hGbf6QEgWBuAUeqykHYDQXHa+6IiZavE3bYtpcjIZiKOFybKIi0go+lxEkBjoHgT9-71pMtCqsgBDBCQMC4AAQiEYsjUeDE3BaJDnuYGh7HYYijqh3bMYrlw2NhMgsxtbMc1j3PkvWILhAQ4QkJw6B4AAZlbUwi2A4uS9LamyyOEitNoaJIgoeioVyEhxbcppomolgG91n3o8BnPYzlv31v9kFHepKiiUadxWJaZQPY155ogmVqlFmliRzHK5x+zCcmzlEti1REG0RnDHjWFdVplFUM07IVoxdYbEaMz1nraQAJAiCOMtx7wOIG+RonaacH592VNJrT86ImoU4KM01dT8C1vJzzSnUQDh6e+sXK1GeF6DsO6vVCd+Q6eyu-700zhdEQBAQDgIIT8o0Cbt3WAAWmkLaCBmIpAWAQYghBKVx5dRIBbK2YQ8BgHTqA9Ymgg7VDEPkYeolvaulqE+auu1cC4JlvgwhxhTAYjzFaQOOwPQgP6GfM28Q6E32MNeMwzRzSqFaAPZMtoOhGksvFCwuJ2gLlQR9NG-CF4IEfBICoppdLmFNEWRhGxTAPTzBKAhU53xrTQT1HGai9RPgnNou4GIZBCQelTe0tNK7LXKOeauNieGKRwW3PBRwMTMWet2cQI4aqIg8bkLxzQfEnE4QRVm0kbZZTscde4wozJ2BTFaOwgpDL8lYu-XMVolbezsP42uDkdpqmyZnKODp8mDnzsUpGRk9IFEeq0KO5w7ipJsrHNGmS+qBK3M02Wpo+JhXKGYocrEekThMU0IZQyOrKNRmzBp-U8rBMOqEhAYhdIK3KLcPSbjuwvx4r09Z2gkaYUHHU8ZO49wzNvnvPJudCm5xKbeXM80TCLSzFccUby2YfMaZQL5Rx9g5wKZ05o3SoaChIEjZ6g597xWsFCjJMLTZBPhQKYyCzUxZiHIYu6mLnQmPEaJEZE8a7jONuBUl54TRIo6UU1FpTX6YRII+SwSYRyPkRASlU7LsY0M5QQkQPL8waFzHyV+ej+K5gsCaDETopVVhlcS6ZIT6FHAeoaMKmIxVog3qhdk6IOkpgGTdPxOz0nSvrlzRuktSVRL4uUUSlh9iBrUFTe1RpHV6SGXkMeViVFG09UnTykAACCib5VzXaf8rpAqEUnEdBidQlxyknSPoCE+pKhxaIrro1xBixzMWuhTZ8TqbpluntbOVJqBFNV6U42t+j3GoSnPAywQktW3IUO2k+RqKScpSQmEQOhjhFhHK+SQm8YYWERCw60TR5DUPAjSOkGBK2Dkxd2cdT5zTmiLsPLRhbl1yGUIoOptBfW2AdHIRQCEB4ND0lTV0Cs7CKD0gPQc5h8W-yAA */
        id: 'validation',
        initial: 'init',
        states: {
            errorState: {
                entry: ['assignError', 'transitionToNext'],
            },

            init: {
                entry: pure(
                    (ctx: PayeeValidationContext, evt: AnyEventObject) => {
                        return !ctx || !ctx.payee || !ctx.payee.payeeUType
                            ? [
                                  assign({
                                      errors: ctx.errors.concat([
                                          {
                                              id: 'payeeUType',
                                              text: 'Invalid Payee',
                                          },
                                      ]),
                                  }),
                                  raise('next'),
                              ]
                            : raise('next');
                    },
                ),
                on: {
                    next: {
                        target: 'checkedStructure',
                    },
                },
            },
            checkedStructure: {
                entry: pure(
                    (ctx: PayeeValidationContext, evt: AnyEventObject) => {
                        return Object.keys(ctx.payee).includes(
                            ctx.payee.payeeUType,
                        )
                            ? raise(ctx.payee.payeeUType)
                            : [
                                  assign({
                                      errors: ctx.errors.concat([
                                          {
                                              id: 'payeeUType',
                                              text: 'Invalid Payee',
                                          },
                                      ]),
                                  }),
                                  raise('next'),
                              ];
                    },
                ),
                on: {
                    next: {
                        target: '#validation.done',
                    },
                    domestic: {
                        target: 'domestic',
                    },
                    biller: {
                        target: 'biller',
                    },
                    international: {
                        target: 'international',
                    },
                },
            },
            domestic: {
                initial: 'init',
                type: 'compound',
                states: {
                    init: {
                        entry: pure(
                            (
                                ctx: PayeeValidationContext,
                                evt: AnyEventObject,
                            ) => {
                                return !ctx.payee.domestic ||
                                    !ctx.payee.domestic.payeeAccountUType
                                    ? [
                                          assign({
                                              errors: ctx.errors.concat([
                                                  {
                                                      id: 'payeeAccountUType',
                                                      text: 'Invalid Payee',
                                                  },
                                              ]),
                                          }),
                                          raise('next'),
                                      ]
                                    : raise('next');
                            },
                        ),
                        on: {
                            next: {
                                target: 'checkedStructure',
                            },
                        },
                    },
                    checkedStructure: {
                        entry: pure(
                            (
                                ctx: PayeeValidationContext,
                                evt: AnyEventObject,
                            ) => {
                                return Object.keys(
                                    ctx.payee.domestic as Domestic,
                                ).includes(
                                    ctx.payee.domestic
                                        ?.payeeAccountUType as string,
                                )
                                    ? raise(
                                          ctx.payee.domestic
                                              ?.payeeAccountUType as string,
                                      )
                                    : [
                                          assign({
                                              errors: ctx.errors.concat([
                                                  {
                                                      id: 'payeeAccountUType',
                                                      text: 'Invalid Payee',
                                                  },
                                              ]),
                                          }),
                                          raise('next'),
                                      ];
                            },
                        ),
                        on: {
                            next: {
                                target: '#validation.done',
                            },
                            payId: {
                                target: 'payId',
                            },
                            card: {
                                target: 'card',
                            },
                            account: {
                                target: 'account',
                            },
                        },
                    },
                    payId: {
                        initial: 'init',
                        states: {
                            init: {
                                entry: pure(
                                    (
                                        ctx: PayeeValidationContext,
                                        evt: AnyEventObject,
                                    ) => {
                                        return !ctx.payee.domestic?.payId
                                            ? [
                                                  assign({
                                                      errors: ctx.errors.concat(
                                                          [
                                                              {
                                                                  id: 'payeeAccountUType',
                                                                  text: 'Invalid Payee',
                                                              },
                                                          ],
                                                      ),
                                                  }),
                                                  raise('next'),
                                              ]
                                            : raise('next');
                                    },
                                ),
                                on: {
                                    next: {
                                        target: 'checkedStructure',
                                    },
                                },
                            },
                            checkedStructure: {
                                entry: pure(
                                    (
                                        ctx: PayeeValidationContext,
                                        evt: AnyEventObject,
                                    ) => {
                                        return (ctx.payee.domestic?.payId
                                            ?.type as string) in
                                            ['email', 'phone']
                                            ? [
                                                  assign({
                                                      errors: ctx.errors.concat(
                                                          [
                                                              {
                                                                  id: 'type',
                                                                  text: 'payId Type must be either email of phone',
                                                              },
                                                          ],
                                                      ),
                                                  }),
                                                  raise('next'),
                                              ]
                                            : raise('next');
                                    },
                                ),
                                on: {
                                    next: {
                                        target: 'checkedType',
                                    },
                                },
                            },
                            checkedType: {
                                entry: pure(
                                    (
                                        ctx: PayeeValidationContext,
                                        evt: AnyEventObject,
                                    ) => {
                                        let eventName: string =
                                            (ctx.payee.domestic?.payId
                                                ?.type as string) in
                                            ['email', 'phone']
                                                ? 'check_' +
                                                  (ctx.payee.domestic?.payId
                                                      ?.type as string)
                                                : 'next';
                                        return !ctx.payee.domestic?.payId
                                            ?.identifier
                                            ? [
                                                  assign({
                                                      errors: ctx.errors.concat(
                                                          [
                                                              {
                                                                  id: 'payeeAccountUType',
                                                                  text: 'Invalid Payee',
                                                              },
                                                          ],
                                                      ),
                                                  }),
                                                  raise(eventName),
                                              ]
                                            : raise(eventName);
                                    },
                                ),
                                on: {
                                    check_email: {
                                        target: '#validation.done',
                                        actions: [
                                            pure(
                                                (
                                                    ctx: PayeeValidationContext,
                                                    evt: AnyEventObject,
                                                ) => {
                                                    return !(
                                                        ctx.payee.domestic
                                                            ?.payId
                                                            ?.identifier as string
                                                    ).match(email_regex)
                                                        ? assign({
                                                              errors: ctx.errors.concat(
                                                                  [
                                                                      {
                                                                          id: 'identifier',
                                                                          text: 'payId doesnt appear to be a valid email',
                                                                      },
                                                                  ],
                                                              ),
                                                          })
                                                        : undefined;
                                                },
                                            ),
                                        ],
                                    },
                                    check_phone: {
                                        target: '#validation.done',
                                    },
                                    next: {
                                        target: '#validation.done',
                                    },
                                },
                            },
                        },
                    },
                    card: {
                        initial: 'init',
                        states: {
                            init: {
                                entry: pure(
                                    (
                                        ctx: PayeeValidationContext,
                                        evt: AnyEventObject,
                                    ) => {
                                        return !ctx.payee.domestic?.card
                                            ? [
                                                  assign({
                                                      errors: ctx.errors.concat(
                                                          [
                                                              {
                                                                  id: 'payeeAccountUType',
                                                                  text: 'Invalid Payee',
                                                              },
                                                          ],
                                                      ),
                                                  }),
                                                  raise('next'),
                                              ]
                                            : raise('next');
                                    },
                                ),
                                on: {
                                    next: {
                                        target: 'checkedStructure',
                                    },
                                },
                            },
                            checkedStructure: {
                                entry: pure(
                                    (
                                        ctx: PayeeValidationContext,
                                        evt: AnyEventObject,
                                    ) => {
                                        return !(
                                            ctx.payee.domestic?.card
                                                ?.cardNumber as string
                                        ).match(cc_regex)
                                            ? [
                                                  assign({
                                                      errors: ctx.errors.concat(
                                                          [
                                                              {
                                                                  id: 'type',
                                                                  text: 'The card number does not seem to be valid',
                                                              },
                                                          ],
                                                      ),
                                                  }),
                                                  raise('next'),
                                              ]
                                            : raise('next');
                                    },
                                ),
                                on: {
                                    next: {
                                        target: '#validation.done',
                                    },
                                },
                            },
                        },
                    },
                    account: {
                        initial: 'init',
                        states: {
                            init: {
                                entry: pure(
                                    (
                                        ctx: PayeeValidationContext,
                                        evt: AnyEventObject,
                                    ) => {
                                        return !ctx.payee.domestic?.account
                                            ? [
                                                  assign({
                                                      errors: ctx.errors.concat(
                                                          [
                                                              {
                                                                  id: 'payeeAccountUType',
                                                                  text: 'Invalid Payee',
                                                              },
                                                          ],
                                                      ),
                                                  }),
                                                  raise('next'),
                                              ]
                                            : raise('next');
                                    },
                                ),
                                on: {
                                    next: {
                                        target: 'checkedStructure',
                                    },
                                },
                            },
                            checkedStructure: {
                                invoke: {
                                    id: 'getBSB',
                                    src: getBSB,
                                    onDone: {
                                        actions: pure(
                                            (
                                                ctx: PayeeValidationContext,
                                                event,
                                            ) => {
                                                let errArray: ValidationErrors[] =
                                                    ctx.errors.concat([
                                                        {
                                                            id: 'bsb',
                                                            text: 'The BSB is not valid',
                                                        },
                                                    ]);
                                                if (event.data.bsbs !== 1) {
                                                    return assign({
                                                        errors: errArray,
                                                    });
                                                }
                                                return undefined;
                                            },
                                        ),
                                        target: 'checkedBSB',
                                    },
                                    onError: {
                                        actions: pure(
                                            (
                                                ctx: PayeeValidationContext,
                                                event,
                                            ) => {
                                                let errArray: ValidationErrors[] =
                                                    ctx.errors.concat([
                                                        {
                                                            id: 'bsb',
                                                            text: 'The BSB is not valid',
                                                        },
                                                    ]);
                                                return assign({
                                                    errors: errArray,
                                                });
                                            },
                                        ),
                                        target: 'checkedBSB',
                                    },
                                },
                            },
                            checkedBSB: {
                                entry: pure(
                                    (
                                        ctx: PayeeValidationContext,
                                        evt: AnyEventObject,
                                    ) => {
                                        return !ctx.payee.domestic?.account
                                            ?.accountNumber
                                            ? [
                                                  assign({
                                                      errors: ctx.errors.concat(
                                                          [
                                                              {
                                                                  id: 'accountNumber',
                                                                  text: 'The account number needs to be specified',
                                                              },
                                                          ],
                                                      ),
                                                  }),
                                                  raise('next'),
                                              ]
                                            : raise('next');
                                    },
                                ),
                                on: {
                                    next: {
                                        target: '#validation.done',
                                    },
                                },
                            },
                            checkedAccount: {},
                        },
                    },
                },
            },
            biller: {
                initial: 'init',
                type: 'compound',
                states: {
                    init: {
                        entry: pure(
                            (
                                ctx: PayeeValidationContext,
                                evt: AnyEventObject,
                            ) => {
                                return !ctx.payee.biller
                                    ? [
                                          assign({
                                              errors: ctx.errors.concat([
                                                  {
                                                      id: 'payeeUType',
                                                      text: 'Invalid Payee',
                                                  },
                                              ]),
                                          }),
                                          raise('next'),
                                      ]
                                    : raise('next');
                            },
                        ),
                        on: {
                            next: {
                                target: 'checkedStructure',
                            },
                        },
                    },
                    checkedStructure: {
                        entry: pure(
                            (
                                ctx: PayeeValidationContext,
                                _evt: AnyEventObject,
                            ) => {
                                return (ctx.payee.biller?.billerCode as string)
                                    .length < 4 ||
                                    (ctx.payee.biller?.billerCode as string)
                                        .length > 6
                                    ? [
                                          assign({
                                              errors: ctx.errors.concat([
                                                  {
                                                      id: 'billerCode',
                                                      text: 'The biller code must be between 4 and 6 characters',
                                                  },
                                              ]),
                                          }),
                                          raise('next'),
                                      ]
                                    : raise('next');
                            },
                        ),
                        on: {
                            next: {
                                target: '#validation.done',
                            },
                        },
                    },
                },
            },
            international: {},
            done: {
                type: 'final',
                data: (ctx: PayeeValidationContext, _evt: AnyEventObject) => {
                    return { errors: ctx.errors };
                },
            },
        },
    },
    {},
);
