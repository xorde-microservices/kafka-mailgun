import { Repository } from 'typeorm';

/* Get all columns of entity, even unselected ones */
export function getColumns<T>(repository: Repository<T>): (keyof T)[] {
	return repository.metadata.columns.map((col) => col.propertyName) as (keyof T)[];
}
