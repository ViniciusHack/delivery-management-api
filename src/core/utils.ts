import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type PaginationParams = {
  page: number;
  perPage: number;
};

const pageQueryValidationSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const perPageQueryValidationSchema = z
  .string()
  .optional()
  .default('20')
  .transform(Number)
  .pipe(z.number().min(1));

export type PageQueryParamSchema = z.infer<typeof pageQueryValidationSchema>;

export const pageQueryValidationPipe = new ZodValidationPipe(
  pageQueryValidationSchema,
);

export type PerPageQueryParamSchema = z.infer<
  typeof perPageQueryValidationSchema
>;

export const perPageQueryValidationPipe = new ZodValidationPipe(
  perPageQueryValidationSchema,
);

interface Coordinate {
  latitude: number;
  longitude: number;
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0;
  }

  const fromRadian = (Math.PI * from.latitude) / 180;
  const toRadian = (Math.PI * to.latitude) / 180;

  const theta = from.longitude - to.longitude;
  const radTheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;

  return dist;
}
