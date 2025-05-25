const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models");
const { AppUser } = initModels(sequelize);
const { Sequelize, Op } = require("sequelize");
const NoChangesError = require("./exceptions/noChangesError");
const ID_ROLE_ADMIN = 2;
async function findUserByEmail(email) {
  try {
    return await AppUser.findOne({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("email")),
        Op.eq,
        email.toLowerCase()
      ),
    });
  } catch (error) {
    if (error instanceof Sequelize.ConnectionError) {
      throw new Error("Cannot connect to the database.");
    }
    if (error instanceof Sequelize.DatabaseError) {
      throw new Error("Database error occurred.");
    }
    throw error;
  }
}

async function findUserByName(name) {
  try {
    return await AppUser.findOne({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("nameUser")),
        Op.eq,
        name.toLowerCase()
      ),
    });
  } catch (error) {
    if (error instanceof Sequelize.ConnectionError) {
      throw new Error("Cannot connect to the database.");
    }
    if (error instanceof Sequelize.DatabaseError) {
      throw new Error("Database error occurred.");
    }
    throw error;
  }
}
async function createUser(data) {
  try {
    return await AppUser.create(data);
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      throw new Error("A user with that email already exists.");
    }
    if (error instanceof Sequelize.ConnectionError) {
      throw new Error("Could not connect to the database.");
    }
    throw error;
  }
}

async function updateUserById(userId, updateData) {
  const [rowsUpdated] = await AppUser.update(updateData, {
    where: { idUser: userId },
  });

  const user = await AppUser.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (rowsUpdated === 0) {
    throw new NoChangesError();
  }
  const updatedUser = await AppUser.findByPk(userId);

  return updatedUser;
}

async function findUserById(id) {
  try {
    const user = await AppUser.findByPk(id);
    if (!user) {
      throw new Error("User not found. Id" + id);
    }
    return user;
  } catch (error) {
    if (error instanceof Sequelize.ConnectionError) {
      throw new Error("Cannot connect to the database.");
    }
    if (error instanceof Sequelize.DatabaseError) {
      throw new Error("Database error occurred.");
    }
    throw error;
  }
}

async function updateUserPasswordByEmail(email, hashedPassword) {
  const [rowsUpdated] = await AppUser.update(
    { password: hashedPassword },
    {
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("email")),
        Op.eq,
        email.toLowerCase()
      ),
    }
  );

  if (rowsUpdated === 0) {
    throw new Error("User not found or password not updated");
  }
}

module.exports = {
  ID_ROLE_ADMIN,
  findUserByEmail,
  findUserByName,
  createUser,
  updateUserById,
  findUserById,
  updateUserPasswordByEmail,
};
