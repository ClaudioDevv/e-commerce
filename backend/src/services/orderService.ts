import { Decimal } from 'decimal.js'
import { AppError } from '../utils/AppError'
import { prisma } from '../lib/prisma'
import { CartItem, ProductVariant, Customizable, DayOfWeek, Settings, Product, CartItemCustomization, ProductBaseCustomizable, ProductAvailableCustomizable } from '../generated/prisma'
import { calculateCartItemPrice } from '../utils/priceCalculator'
import { CustomizationInput, validateVariant } from './cartService'

const MAX_PENDING_ORDERS = 3
const MILLISECONDS_PER_MINUTE = 60000
const SCHEDULE_INTERVAL_MINUTES = 15

interface TimeSlot {
  time: string // "HH:MM"
  available: boolean
  estimatedDelivery?: Date
}

interface GuestOrderItem {
  productId: string
  variantId?: string
  quantity: number
  notes?: string
  customizations?: CustomizationInput[]
}

type ItemWithPrice = {
  productId: string
  product: Product
  variantId?: string | null
  variant?: ProductVariant | null
  quantity: number
  notes?: string | null
  customizations: Array<{
    customizableId: number
    customizable: Customizable
    action: 'ADD' | 'REMOVE'
  }>
}

const validateCustomizationsWithData = (
  product: Product & {
    baseCustomizables: ProductBaseCustomizable[]
    availableCustomizables: ProductAvailableCustomizable[]
  },
  customizations: CustomizationInput[],
  availableCustomizables: Customizable[]
): void => {
  if (!customizations || customizations.length === 0) {
    return
  }

  if (!product.allowCustomization) {
    throw new AppError(`"${product.name}" no admite personalización`, 400)
  }

  const customizableIds = customizations.map(c => c.customizableId)
  const uniqueIds = new Set(customizableIds)
  if (uniqueIds.size !== customizableIds.length) {
    throw new AppError('No se pueden enviar personalizaciones duplicadas', 400)
  }

  // Verificar que todos los IDs existen en los customizables disponibles
  const availableIds = new Set(availableCustomizables.map(c => c.id))

  for (const customization of customizations) {
    if (!availableIds.has(customization.customizableId)) {
      throw new AppError('Una o más personalizaciones no están disponibles', 400)
    }

    const customizable = availableCustomizables.find(c => c.id === customization.customizableId)

    if (!customizable || !customizable.available) {
      throw new AppError('Una o más personalizaciones no están disponibles', 400)
    }

    if (customization.action === 'REMOVE') {
      const baseItem = product.baseCustomizables.find(
        bc => bc.customizableId === customization.customizableId
      )

      if (!baseItem) {
        throw new AppError(`No puedes quitar "${customizable.name}" porque no viene incluido en "${product.name}"`, 400)
      }

      if (!baseItem.isRemovable) {
        throw new AppError(`No puedes quitar "${customizable.name}" de "${product.name}"`, 400)
      }
    } else if (customization.action === 'ADD') {
      const isAvailable = product.availableCustomizables.some(
        ac => ac.customizableId === customization.customizableId
      )

      if (!isAvailable) {
        throw new AppError(`No puedes añadir "${customizable.name}" a "${product.name}"`, 400)
      }
    }
  }
}

export const validateCartItems = async (
  cartItems: (CartItem & {
    product: Product
    variant: ProductVariant | null
    customizations: (CartItemCustomization & {
      customizable: Customizable
    })[]
  })[]
): Promise<void> => {
  if (!cartItems || cartItems.length === 0) {
    throw new AppError('El carrito está vacío', 400)
  }

  const productsIds: Set<string> = new Set()
  const customizablesIds: Set<number> = new Set()

  cartItems.forEach(item => {
    productsIds.add(item.productId)
    item.customizations.forEach(c => {
      customizablesIds.add(c.customizableId)
    })
  })

  const products = await prisma.product.findMany({
    where: {
      id: { in: [...productsIds] },
      active: true
    },
    include: {
      variants: { where: { active: true } },
      baseCustomizables: true,
      availableCustomizables: true
    }
  })

  const customizables = customizablesIds.size > 0
    ? await prisma.customizable.findMany({
      where: {
        id: { in: [...customizablesIds] },
        available: true
      }
    })
    : []

  for (const item of cartItems) {
    const product = products.find(prod => prod.id === item.productId)

    if (!product) {
      throw new AppError('Producto no disponible', 404)
    }

    validateVariant(product.variants, item.variantId ?? undefined)

    validateCustomizationsWithData(
      product,
      item.customizations.map(c => ({
        customizableId: c.customizableId,
        action: c.action
      })),
      customizables
    )
  }
}

export const enrichAndValidateGuestItems = async (cartItems: GuestOrderItem[]): Promise<ItemWithPrice[]> => {
  if (!cartItems || cartItems.length === 0) {
    throw new AppError('El pedido está vacío', 400)
  }

  const productsIds: Set<string> = new Set()
  const customizablesIds: Set<number> = new Set()

  cartItems.forEach(item => {
    productsIds.add(item.productId)
    if (item.customizations) {
      item.customizations.forEach(c => {
        customizablesIds.add(c.customizableId)
      })
    }
  })

  const products = await prisma.product.findMany({
    where: {
      id: { in: [...productsIds] },
      active: true
    },
    include: {
      variants: { where: { active: true } },
      baseCustomizables: true,
      availableCustomizables: true
    }
  })

  const customizables = customizablesIds.size > 0
    ? await prisma.customizable.findMany({
      where: {
        id: { in: [...customizablesIds] },
        available: true
      }
    })
    : []

  const enrichedItems: ItemWithPrice[] = []

  // Validar y enriquecer cada item
  for (const item of cartItems) {
    const product = products.find(prod => prod.id === item.productId)

    if (!product) {
      throw new AppError('Producto no disponible', 404)
    }

    validateVariant(product.variants, item.variantId)

    const variant = item.variantId
      ? product.variants.find(v => v.id === item.variantId)
      : undefined

    // Enriquecer customizaciones con datos completos
    const enrichedCustomIngredients = []
    if (item.customizations && item.customizations.length > 0) {
      validateCustomizationsWithData(product, item.customizations, customizables)

      for (const customization of item.customizations) {
        const custom = customizables.find(c => c.id === customization.customizableId)

        if (!custom) {
          throw new AppError(`Ingrediente seleccionado en ${product.name} no está disponible`, 400)
        }

        enrichedCustomIngredients.push({
          customizableId: customization.customizableId,
          customizable: custom,
          action: customization.action
        })
      }
    }

    enrichedItems.push({
      productId: item.productId,
      product,
      variantId: item.variantId ?? null,
      variant: variant ?? null,
      quantity: item.quantity,
      notes: item.notes ?? null,
      customizations: enrichedCustomIngredients
    })
  }

  return enrichedItems
}

export const calculateSubtotal = (cartItems: ItemWithPrice[]) => {
  let subtotal = new Decimal(0)

  const itemsWithPrices = cartItems.map(item => {
    const addedCustomizables = item.customizations
      .filter(c => c.action === 'ADD')
      .map(c => c.customizable)

    const unitPrice = calculateCartItemPrice(
      item.product.basePrice,
      item.variant?.priceDelta,
      addedCustomizables
    )

    const itemSubtotal = unitPrice.mul(item.quantity)
    subtotal = subtotal.add(itemSubtotal)

    return {
      ...item,
      unitPrice,
      itemSubtotal
    }
  })

  return { itemsWithPrices, subtotal }
}

// ================ HORARIOS ==============
function formatTime (date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function getDayOfWeek (date: Date): DayOfWeek {
  const days: DayOfWeek[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
  ]
  return days[date.getDay()]
}

function timeStringToDate (timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

function roundToNextInterval (date: Date, intervalMinutes: number): Date {
  const minutes = date.getMinutes()
  const remainder = minutes % intervalMinutes

  if (remainder === 0) {
    return date
  }

  const minutesToAdd = intervalMinutes - remainder
  return new Date(date.getTime() + minutesToAdd * MILLISECONDS_PER_MINUTE)
}

async function getTodayBusinessHours (): Promise<Array<{ openTime: string; closeTime: string }> | null> {
  const today = new Date()
  const dayOfWeek = getDayOfWeek(today)

  // Verificar horarios especiales primero
  const specialHours = await prisma.specialHours.findUnique({
    where: { date: new Date(today.toDateString()) }
  })

  if (specialHours) {
    if (specialHours.isClosed) {
      return null
    }

    if (specialHours.openTime && specialHours.closeTime) {
      return [{
        openTime: specialHours.openTime,
        closeTime: specialHours.closeTime
      }]
    }
  }

  // Verificar horarios regulares
  const businessHours = await prisma.businessHours.findMany({
    where: {
      dayOfWeek,
      isClosed: false
    },
    orderBy: { order: 'asc' }
  })

  if (businessHours.length === 0) {
    return null
  }

  return businessHours.map(h => ({
    openTime: h.openTime,
    closeTime: h.closeTime
  }))
}

export const isBusinessOpenNow = async (): Promise<boolean> => {
  const hours = await getTodayBusinessHours()

  if (!hours) {
    return false
  }

  const now = formatTime(new Date())

  return hours.some(slot =>
    now >= slot.openTime && now <= slot.closeTime
  )
}

export const getAvailableTimeSlots = async (settings: Settings): Promise<TimeSlot[]> => {
  const hours = await getTodayBusinessHours()

  if (!hours) {
    return []
  }

  const now = new Date()
  const minimumTime = new Date(
    now.getTime() + settings.avgPrepMinutes * MILLISECONDS_PER_MINUTE
  )

  // Redondear al siguiente intervalo
  const startTime = roundToNextInterval(minimumTime, SCHEDULE_INTERVAL_MINUTES)

  const slots: TimeSlot[] = []

  // Para cada franja horaria del día
  for (const slot of hours) {
    const closeTime = timeStringToDate(slot.closeTime)
    let currentTime = new Date(startTime)

    // Si el startTime es después del cierre de esta franja, saltar
    if (currentTime > closeTime) {
      continue
    }

    // Si el startTime es antes de la apertura, ajustar
    const openTime = timeStringToDate(slot.openTime)
    if (currentTime < openTime) {
      currentTime = roundToNextInterval(openTime, SCHEDULE_INTERVAL_MINUTES)
    }

    // Generar slots cada 15 minutos hasta el cierre
    while (currentTime <= closeTime) {
      slots.push({
        time: formatTime(currentTime),
        available: true,
        estimatedDelivery: new Date(currentTime)
      })

      currentTime = new Date(
        currentTime.getTime() + SCHEDULE_INTERVAL_MINUTES * MILLISECONDS_PER_MINUTE
      )
    }
  }

  return slots
}

export const validateScheduledTime = async (
  scheduledFor: Date,
  settings: Settings
): Promise<void> => {
  const now = new Date()

  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)

  const todayEnd = new Date(now)
  todayEnd.setHours(23, 59, 59, 999)

  const scheduledDate = new Date(scheduledFor)

  if (scheduledDate < todayStart || scheduledDate > todayEnd) {
    throw new AppError('Solo se pueden programar entregas para el día de hoy', 400)
  }

  // Verificar que sea futura y tenga suficiente tiempo de preparación
  const minimumTime = new Date(
    now.getTime() + settings.avgPrepMinutes * MILLISECONDS_PER_MINUTE
  )

  if (scheduledFor < minimumTime) {
    throw new AppError(
      `La hora programada debe ser al menos ${settings.avgPrepMinutes} minutos en el futuro`,
      400
    )
  }

  // Verificar que los minutos sean múltiplos de 15
  const minutes = scheduledFor.getMinutes()
  if (minutes % SCHEDULE_INTERVAL_MINUTES !== 0) {
    throw new AppError(
      'Solo se permiten horarios en intervalos de 15 minutos (ej: 20:00, 20:15, 20:30, 20:45)',
      400
    )
  }

  // Verificar que caiga dentro de horarios de apertura
  const hours = await getTodayBusinessHours()

  if (!hours) {
    throw new AppError('El negocio está cerrado hoy', 400)
  }

  const timeString = formatTime(scheduledFor)

  const isInOpenHours = hours.some(slot =>
    timeString >= slot.openTime && timeString <= slot.closeTime
  )

  if (!isInOpenHours) {
    const ranges = hours.map(h => `${h.openTime}-${h.closeTime}`).join(', ')
    throw new AppError(
      `La hora seleccionada está fuera del horario de apertura. Horarios disponibles: ${ranges}`,
      400
    )
  }
}

export const checkBusinessStatus = async (settings: Settings): Promise<void> => {
  if (settings.temporarilyClosed) {
    throw new AppError(settings.statusMessage || 'El negocio está temporalmente cerrado', 400)
  }
}

export const calculateEstimatedTime = async (
  settings: Settings,
  scheduledFor?: Date
): Promise<Date> => {
  // Si está programado, ya fue validado, solo retornar
  if (scheduledFor) {
    return new Date(scheduledFor)
  }

  // Calcular tiempo estimado
  const now = new Date()
  const estimatedTime = new Date(
    now.getTime() + settings.avgPrepMinutes * MILLISECONDS_PER_MINUTE
  )

  // Redondear al siguiente intervalo de 15 minutos
  const roundedTime = roundToNextInterval(estimatedTime, SCHEDULE_INTERVAL_MINUTES)

  // Verificar que caiga en horarios de apertura
  const hours = await getTodayBusinessHours()

  if (!hours) {
    throw new AppError('El negocio está cerrado. No se pueden procesar pedidos en este momento.', 400)
  }

  const timeString = formatTime(roundedTime)

  // Verificar si cae en alguna franja horaria
  const isInOpenHours = hours.some(slot =>
    timeString >= slot.openTime && timeString <= slot.closeTime
  )

  if (!isInOpenHours) {
    throw new AppError(
      'El pedido no puede completarse dentro del horario de apertura de hoy. Por favor, intenta más tarde o programa para mañana.',
      400
    )
  }

  return roundedTime
}

// Importe mínimo de pedido para domicilio (No implementado)
export const validateMinimumOrder = (subtotal: Decimal, settings: Settings): void => {
  if (subtotal.lessThan(settings.minOrderAmount)) {
    throw new AppError(`El pedido mínimo es de ${settings.minOrderAmount}€`, 400)
  }
}

// Valida que el usuario no tenga muchos pedidos pendientes (No implementado)
export const validatePendingOrders = async (userId: string): Promise<void> => {
  const pendingOrders = await prisma.order.count({
    where: {
      userId,
      status: 'PENDING',
      createdAt: {
        gte: new Date(Date.now() - 30 * MILLISECONDS_PER_MINUTE)
      }
    }
  })

  if (pendingOrders >= MAX_PENDING_ORDERS) {
    throw new AppError(
      'Tienes pedidos pendientes de pago. Completa o cancela tus pedidos anteriores antes de crear uno nuevo.',
      400
    )
  }
}
