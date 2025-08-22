import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Forgot_Password_Entity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    email:string;

    @Column('text')
    token: string;

    @Column({ type: 'timestamp' })
    expires_at: Date;

    @Column({ default: false })
    used: boolean;

    @CreateDateColumn()
    created_at: Date;
}