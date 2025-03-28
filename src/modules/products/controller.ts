import {productModel} from './model'
import {Request, Response} from 'express';
import axios from 'axios';

const urlApi = 'https://fakestoreapi.com'


export class productController {
    static async getAllProducts(req: Request, res: Response) {
        try {
            console.log('getAllProducts');

            let products = await axios.get(urlApi + '/products')


            if (products.status !== 200 || !products.data) {

                throw new Error('Error, not found')

            }


            return res.status(200).json({
                message: 'success',
                data: products.data
            })
        } catch
            (e) {
            console.log('Error getting all products')
            res.status(500).json({
                message: 'Error getting all products',
                error: 'Error getting all products'
            })

        }
    }

    static async createOneProduct(req: Request, res: Response) {
        try {
            let body = req.body

            if (!body.id) {
                throw new Error('Error, not found id .')
            }


            let product = await axios.get(urlApi + '/products/' + body.id)
            console.log(product.data)
            let data = product.data

            let newProduct = new productModel({
                idForeign: data.id,
                title: data.title,
                price: data.price,
                description: data.description,
                category: data.category,
                image: data.image
            })

            await newProduct.save()
            return res.status(200).json({
                message: 'success',
                data: newProduct
            })

        } catch (e) {
            console.log('Error getting all products');
            res.status(500).json({
                message: 'Error getting all products',
                error: 'Error getting all products'
            })


        }


    }

    static async addnewproduct(req: Request, res: Response) {
        try {
            let body = req.body

            if (!body.id) {
                throw new Error('Error, not found id .')
            }


            let product = await axios.get(urlApi + '/products/' + body.id)
            console.log(product.data)
            let data = product.data

            let newProduct = new productModel({
                idForeign: data.id,
                title: data.title,
                price: data.price,
                description: data.description,
                category: data.category,
                image: data.image
            })

            await newProduct.save()
            return res.status(200).json({
                message: 'success',
                data: newProduct
            })

        } catch (e) {
            console.log('Error getting all products');
            res.status(500).json({
                message: 'Error getting all products',
                error: 'Error getting all products'
            })


        }


    }
}