import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare nickname: string;
  declare content: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initiate(sequelize: Sequelize) {
    Post.init(
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

  static associate(models: any) {
    Post.belongsTo(models.User);
    Post.belongsToMany(models.Hashtag, { through: "PostHashtag" });
    Post.belongsToMany(models.User, { through: "Like", as: "Likers" });
    Post.belongsTo(models.Post);
    Post.hasMany(models.Comment);
    Post.hasMany(models.Image, { as: "Retweet" });
  }
}

export default Post;
