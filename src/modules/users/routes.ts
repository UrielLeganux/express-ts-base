import {Router} from 'express';
import {UserModel} from './model';
import {ApiatoNoSQL} from '../../libs/apiato/no-sql/apiato';
import {validateFirebaseToken, roleGuard} from '../../middleware/auth.middleware';
import {UserRole} from '../../types/user';
import {UserController} from './controller';

const router = Router();
const apiato = new ApiatoNoSQL();


// Empty validation and population objects
const userValidation = {};
const populationObject = {};

// Create datatable method,
router.post('/datatable', [validateFirebaseToken, roleGuard([UserRole.ADMIN])], apiato.datatable_aggregate(UserModel, [], '', {
    allowDiskUse: true,
    search_by_field: true
}));

// Get all with pagination,
router.get('/', [validateFirebaseToken, roleGuard([UserRole.ADMIN])], apiato.getMany(UserModel, populationObject));

// Get one by ID,
router.get('/:id', [validateFirebaseToken, roleGuard([UserRole.ADMIN])], apiato.getOneById(UserModel, populationObject));

// Create new,
router.post('/', apiato.createOne(UserModel, populationObject, {customValidationCode: 400}));

// Update by ID,
router.put('/:id', [validateFirebaseToken, roleGuard([UserRole.ADMIN])], apiato.updateById(UserModel, userValidation, populationObject, {updateFieldName: 'updatedAt'}));

// Delete user (syncs with Firebase)
router.delete('/:id', [validateFirebaseToken, roleGuard([UserRole.ADMIN])], UserController.deleteUser);

// Toggle user active status
router.put('/:id/toggle-active', [validateFirebaseToken, roleGuard([UserRole.ADMIN])], UserController.toggleActive);

// Additional Apiato operations,
router.post('/find-update-create', [validateFirebaseToken, roleGuard([UserRole.ADMIN])], apiato.findUpdateOrCreate(UserModel, userValidation, populationObject, {updateFieldName: 'updatedAt'}));

router.put('/find-update', [validateFirebaseToken, roleGuard([UserRole.ADMIN])], apiato.findUpdate(UserModel, userValidation, populationObject, {updateFieldName: 'updatedAt'}));

router.get('/where/first', [validateFirebaseToken, roleGuard([UserRole.ADMIN])], apiato.getOneWhere(UserModel, populationObject));

export default router;
