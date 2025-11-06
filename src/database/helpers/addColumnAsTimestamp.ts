import { SelectQueryBuilder } from 'typeorm';

/* Add column specified as select:false as timestamp to queryBuilder */
export const addColumnAsTimestamp = <T>(qb: SelectQueryBuilder<T>, name: string): SelectQueryBuilder<T> =>
	qb.addSelect(
		`TRUNC(extract (epoch from ${qb.expressionMap.mainAlias.name}.${name}) * 1000)`,
		`${qb.expressionMap.mainAlias.name}_${name}`,
	);
