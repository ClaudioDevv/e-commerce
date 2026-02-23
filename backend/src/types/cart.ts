import { CustomizationAction } from '../generated/prisma'

export interface CustomizationInput {
  customizableId: number
  action: CustomizationAction
}
