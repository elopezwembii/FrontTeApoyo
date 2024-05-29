export interface Planes {
    id?: number;
    frequency: number;
    frequency_type: string;
    repetitions: number;
    billing_day: number;
    billing_day_proportional: false,
    frequency_free: number;
    frequency_type_free: string;
    transaction_amount: number;
    currency_id: string;
    reason: string;
    created_at?: string;
    update_at?: string;
}