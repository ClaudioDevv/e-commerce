import { Router } from 'express'
import * as addressController from '../controllers/addressController'
import { authenticate } from '../middlewares/auth'
import { validateRequest } from '../middlewares/validateRequest'
import { addressSchema, updateAddressSchema } from '../validators/addressValidator'

const router = Router()

router.use(authenticate)

router.get('/', addressController.getAllAddresses)
router.get('/:id', addressController.getAddressById)

router.post('/', validateRequest(addressSchema), addressController.createAddress)

router.put('/:id', validateRequest(updateAddressSchema), addressController.updateAddress)

router.delete('/:id', addressController.deleteAddressById)

router.patch('/:id/default', addressController.setDefaultAddress)

export default router
