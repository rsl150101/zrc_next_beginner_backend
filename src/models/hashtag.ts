import {
  CreateOptions,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Hashtag extends Model<
  InferAttributes<Hashtag>,
  InferCreationAttributes<Hashtag>
> {
  declare id: CreateOptions<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initiate(sequelize: Sequelize) {
    Hashtag.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: { type: DataTypes.STRING(45) },
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

  static associate(models: any) {
    Hashtag.belongsToMany(models.Post, { through: "PostHashtag" });
  }
}

export default Hashtag;
