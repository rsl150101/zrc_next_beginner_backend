import {
  CreateOptions,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Comment extends Model<
  InferAttributes<Comment>,
  InferCreationAttributes<Comment>
> {
  declare id: CreateOptions<number>;
  declare nickname: string;
  declare content: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initComment(sequelize: Sequelize): void {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nickname: { type: DataTypes.STRING(45), allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
      timestamps: true,
      sequelize,
    }
  );
}
