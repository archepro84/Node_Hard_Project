'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Comments', {
            commentId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            postId: {
                type: Sequelize.INTEGER,
                //Sequelize에서 외래키를 지정하는 방법
                references: {
                    model: 'Posts',
                    key: "postId"
                },
                onDelete: 'cascade'
            },
            userId: {
                type: Sequelize.INTEGER,
                //Sequelize에서 외래키를 지정하는 방법
                references: {
                    model: 'Users',
                    key: "userId"
                },
                onDelete: 'cascade'
            },
            comment: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Comments');
    }
};