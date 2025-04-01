import {OrderModel} from './model'
import {Request, Response} from 'express';
import {PayoutInfoModel} from '../payout_info/model'
import {UserModel} from '../users/model'
import {OpenPayController} from '../openpay/controller'
import {productModel} from "../products/model";


export class orderController {
    static async create(req: Request, res: Response) {

        try {
            let body = req.body;
            const {userId} = req.body;
            console.log(userId);

            const user = await UserModel.findById(userId);
            console.log(user);

            let customer = {
                name: user?.name,
                last_name: '',
                phone_number: '',
                email: user?.email
            }
            console.log(customer)
            let payoutInfo = new PayoutInfoModel({
                payment_type: body.payment_type == 'card_openpay' ? 1 : 2,
                tag: '',
                open_pay_id: '',
                user: userId,
                amount: body.total_amount,
                status: '',
                redirect_link_openpay: '',
                full_JSON: '',
                full_JSON_hook: ''
            })

            payoutInfo = await payoutInfo.save()


            let newOrder = new OrderModel({

                userId: body.userId,
                payout_info: payoutInfo._id,
                product: body.product,
                no_prods: body.no_prods,
                total_amount: body.total_amount,
                key_group: body.key_group,
                payment_type: body.payment_type,
                shipping_type: body.shipping_type,
                status: body.status,
            })
            await newOrder.save()


            if (body.payment_type === 'card_openpay') {
                console.log('ENTRO AL IFFFFFFFFFFFFFFF')

                await OpenPayController.card('venta', newOrder.total_amount, body.userId, payoutInfo._id, '', customer, false)

            }

            return res.status(200).json({
                message: 'Order successfully created!',
                data: newOrder
            })
        } catch
            (error) {
            return res.status(500).json({message: error})
        }
    }
}