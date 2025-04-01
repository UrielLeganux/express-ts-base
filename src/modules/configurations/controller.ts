import {Request, Response} from 'express';
import {ConfigurationModel} from './model';

export class ConfigurationController {

    static async createConfiguration(req: Request, res: Response) {
        try {
            const {description, value} = req.body;


            const newConfiguration = new ConfigurationModel({
                description,
                value,
            });
            await newConfiguration.save();

            res.status(200).json({
                message: 'Configuración guardada exitosamente.',
                success: true,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al guardar configuración';
            res.status(500).json({
                error: errorMessage,
                success: false,
                message: 'Error al guardar configuración',
                code: 500,
                data: {},
            });
        }
    }
}
