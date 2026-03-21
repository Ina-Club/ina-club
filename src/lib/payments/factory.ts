import { MockPaymentProvider } from "./MockPaymentProvider";
import { PaymentServiceProvider } from "./PaymentServiceProvider";

export function getPaymentProvider(pspName: string): PaymentServiceProvider {
    if (pspName === "MOCK_PSP") {
        return new MockPaymentProvider();
    }
    throw new Error(`Unknown PSP: ${pspName}`);
}
