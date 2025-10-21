import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
} from "sequelize-typescript";

@Table({
    tableName: "users",
    timestamps: false,
})
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.ARRAY(DataType.REAL))
    embedding!: number[];
}
