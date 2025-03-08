import {
  CreateOptions,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Image extends Model<
  InferAttributes<Image>,
  InferCreationAttributes<Image>
> {
  declare id: CreateOptions<number>;
  declare src: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initImage(sequelize: Sequelize): void {
  Image.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      src: { type: DataTypes.STRING(200) },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: true,
      sequelize,
    }
  );
}
