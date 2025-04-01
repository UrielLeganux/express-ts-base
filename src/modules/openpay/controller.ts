import {Request, Response} from 'express';
import Openpay from 'openpay'
import util from 'util'
import dayjs from 'dayjs'
import {v4 as uuidv4} from 'uuid'
import {ConfigurationModel} from "../configurations/model"
import PayoutInfoModel from "../payout_info/model";

interface Customer {
    name?: string;
    email?: string;
    phone_number?: string;

    [key: string]: any;
}

interface ChargeRequest {
    method: string;
    amount: number;
    description: string;
    customer: Customer | {};
    currency: string;
    use_3d_secure: boolean;
    send_email: boolean;
    confirm: boolean;
    due_date: string;
    redirect_url: string;
}

const OPENPAY_ACTIVE: boolean = process.env.OPENPAY_ACTIVE === 'true';
let merchantId: string = '',
    privateKey: string = '',
    publicKey: string = '',
    baseUrlDashboard: string = '';

let openpay: OpenpayInstance,
    openpay_charge_create: Function,
    openpay_customer_create: Function,
    openpay_payout: Function

let getByKey = async function (key: string): Promise<string | boolean | null | number> {
    try {
        const query = {description: key} as any;
        const config = await ConfigurationModel.findOne(query);
        if (config) {
            return config.value || false
        } else {
            return false;
        }
    } catch
        (e) {
        console.log('error getByKey', e);
        throw e;
    }
}

const init = async (): Promise<void> => {
    if (OPENPAY_ACTIVE) {
        merchantId = (await getByKey(('merchant_Id'))) as string;
        privateKey = (await getByKey(('private_Key'))) as string;
        publicKey = (await getByKey(('public_Key'))) as string;
        baseUrlDashboard = (await getByKey(('base_Url_Dashboard'))) as string;
    } else {
        merchantId = (await getByKey(('merchant_Id_sandbox'))) as string;
        privateKey = (await getByKey(('private_Key_sandbox'))) as string;
        publicKey = (await getByKey(('public_Key_sandbox'))) as string;
        baseUrlDashboard = (await getByKey(('base_Url_Dashboard_sandbox'))) as string;
    }


    openpay = new Openpay(merchantId, privateKey);
    openpay_charge_create = util.promisify(openpay.charges.create);
    openpay_payout = util.promisify(openpay.charges.get);
    openpay_customer_create = util.promisify(openpay.customers.create);

}
init();

export class OpenPayController {
    static async card(module: string = 'venta', amount: number = 0, userId: any, payoutId: any, description: string, customer: any, isCustom: boolean = false): Promise<any> {
        console.log('ENTRO A LA CARD')


        console.log('Merchant ID:', merchantId);
        console.log('Private Key:', privateKey);
        console.log('public Key:', publicKey);
        console.log('baseUrlDashboard:', baseUrlDashboard);

        if (typeof customer == 'string') {
            customer = customer.trim();
        }

        if (!description) {
            description = 'Pago de libros'
        }

        if (!customer) {
            customer = {}
        }

        let tag = uuidv4()
        const chargeRequest: ChargeRequest = {
            method: 'card',
            amount: amount,
            description: description,
            customer: customer,
            currency: 'MXN',
            use_3d_secure: false,
            send_email: false,
            confirm: false,
            due_date: dayjs().add(2, 'days').format(),
            redirect_url: 'https://luis.thejavascript.zone/'
        }
        console.log(chargeRequest);
        try {
            console.log('entro al try')
            const charge = await openpay_charge_create(chargeRequest);
            console.log('CHARGE', charge)

            let payoutInfo = {
                payment_type : 1,
                tag: tag,
                open_pay_id: charge.id,
                amount: amount,
                userId: userId,
                status: charge.status,
                redirect_link_openpay: charge.payment_method.url,
                full_JSON: charge
            }

            let savePaymentInfo = await PayoutInfoModel.findByIdAndUpdate(payoutId, payoutInfo)

            return savePaymentInfo


        } catch (e) {
            console.error("Error", e);
            throw e;
        }
    }
}

