export interface BsbData {
    bsb: string,
    bsbLabel: string,
    bank: string,
    name: string,
    location: string,
    city: string,
    state: string,
    postcode: string,
    paymentSystems: string[]
}

export interface bsbReturn {
    bsbs:BsbData[]
}