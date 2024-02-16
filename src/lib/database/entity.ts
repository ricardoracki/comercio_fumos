import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("shopping")
export class Shopping extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column("text") customer: string;
  @Column("text", { default: "tick" }) classification: string;
  @Column("numeric") value: number;
  @Column("numeric") amountInKg: number;
  @Column("text", { default: "kg" }) saveFormat: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

@Entity("Sale")
export class Sale extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column("numeric") value: number;
  @Column("numeric") amountInKg: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
