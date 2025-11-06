import {
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	VersionColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id?: string;

	@CreateDateColumn({ type: 'timestamp with time zone', select: false })
	created?: Date;
}

@Entity()
export class VersionedEntity extends BaseEntity {
	@UpdateDateColumn({ type: 'timestamp with time zone', select: false })
	updated?: Date;

	@VersionColumn({ select: false })
	version?: number;
}

@Entity()
export class ImmutableEntity extends BaseEntity {
	// @see: https://typeorm.io/#/decorator-reference/deletedatecolumn
	@DeleteDateColumn({ type: 'timestamp with time zone', select: false })
	deleted?: Date;
}

@Entity()
export class ImmutableVersionedEntity extends VersionedEntity {
	// @see: https://typeorm.io/#/decorator-reference/deletedatecolumn
	@DeleteDateColumn({ type: 'timestamp with time zone', select: false })
	deleted?: Date;
}
