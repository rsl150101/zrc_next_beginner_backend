import {
  CreateOptions,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreateOptions<number>;
  declare email: string;
  declare nickname: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initUser(sequelize: Sequelize): void {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
      },
      nickname: { type: DataTypes.STRING(45), allowNull: false },
      password: { type: DataTypes.STRING(100), allowNull: false },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    { charset: "utf8", collate: "utf8_general_ci", timestamps: true, sequelize }
  );
}
