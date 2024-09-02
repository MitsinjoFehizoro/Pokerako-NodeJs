import { Table, Column, Model, DataType, PrimaryKey, Unique, Default } from 'sequelize-typescript';
import { regexPassword, regexPhone, regexPseudo } from '../tools/regex';

@Table({
    tableName: 'users',
})
class User extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
    })
    id!: string;

    @Unique({
        name: 'unique_phone',
        msg: '📱 Ce numéro est déjà enregistré.'
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isCorrectFormat(value: string) {
                if (!regexPhone.test(value))
                    throw new Error('📵 Numéro invalide.')
            }
        }
    })
    phone!: string;

    @Column({
        type: DataType.CHAR,
        validate: {
            isCorrectFormat(value: string) {
                if (!regexPseudo.test(value))
                    throw new Error("📝 Le pseudo doit contenir 3 à 15 sans aucun caractère spécial.")
            }
        }
    })
    pseudo!: string

    @Column({
        type: DataType.DECIMAL(10, 2),
        defaultValue: 0.00
    })
    balance!: number

    @Column({
        type: DataType.CHAR,
        validate: {
            isCorrectFormat(value: string) {
                if (!regexPassword.test(value))
                    throw new Error('🔐 Le mot de passe doit contenir au moins 4 caractères.')
            }
        }
    })
    password!: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    verification!: boolean
}

export default User;