import { z } from 'zod'

export const productFormSchema = z.object({
  title: z
    .string({ required_error: 'El nombre del producto es obligatorio' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no debe exceder 100 caracteres'),

  description: z
    .string({ required_error: 'La descripción es obligatoria' })
    .min(10, 'La descripción debe tener al menos 10 caracteres'),

  category: z
    .string({ required_error: 'Debe seleccionar una categoría' })
    .min(1, 'Debe seleccionar una categoría'),

  subcategory: z.string().optional().default(''),

  brand: z
    .string({ required_error: 'La marca es obligatoria' })
    .min(2, 'La marca debe tener al menos 2 caracteres'),

  sku: z
    .string({ required_error: 'El SKU es obligatorio' })
    .min(3, 'El SKU debe tener al menos 3 caracteres'),

  price: z
    .number({ required_error: 'El precio es obligatorio', invalid_type_error: 'Ingrese un precio válido' })
    .gt(0, 'El precio debe ser mayor a 0'),

  discountPercentage: z
    .number({ invalid_type_error: 'Ingrese un descuento válido' })
    .min(0, 'El descuento no puede ser negativo')
    .max(100, 'El descuento no puede superar el 100%')
    .optional()
    .default(0),

  rating: z
    .number()
    .min(0, 'El rating no puede ser menor a 0')
    .max(5, 'El rating máximo es 5')
    .optional()
    .default(4.5),

  stock: z
    .number({ required_error: 'El stock es obligatorio', invalid_type_error: 'Ingrese un stock válido' })
    .min(0, 'El stock no puede ser negativo'),

  minimumOrderQuantity: z
    .number({ invalid_type_error: 'Ingrese una cantidad válida' })
    .min(1, 'La cantidad mínima debe ser al menos 1')
    .optional()
    .default(1),

  availabilityStatus: z.string().min(1, 'Seleccione un estado de disponibilidad').default('Activo'),

  warrantyInformation: z.string().optional().default(''),
  shippingInformation: z.string().optional().default(''),
  returnPolicy: z.string().optional().default(''),

  weight: z.number().min(0, 'El peso no puede ser negativo').optional().default(0.5),
  width: z.number().min(0, 'El ancho no puede ser negativo').optional().default(10),
  height: z.number().min(0, 'El alto no puede ser negativo').optional().default(15),
  depth: z.number().min(0, 'La profundidad no puede ser negativa').optional().default(5),

  isFeatured: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(true),
  isOnSale: z.boolean().optional().default(false),
  allowReturn: z.boolean().optional().default(true),

  availabilityDate: z.any().optional(),
  promotionDateRange: z.any().optional(),

  images: z.array(z.string()).optional().default([]),
  thumbnail: z.string().optional().default(''),
})

export type ProductFormSchemaType = z.infer<typeof productFormSchema>
