import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare nickname: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initiate(sequelize: Sequelize) {
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
      {
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: true,
        sequelize,
      }
    );
  }

  static associate(models: any) {
    User.hasMany(models.Post);
    User.hasMany(models.Comment);
    User.belongsToMany(models.Post, { through: "Like", as: "Liked" });
    User.belongsToMany(models.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "followingId",
    });
    User.belongsToMany(models.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "followerId",
    });
  }
}

export default User;
