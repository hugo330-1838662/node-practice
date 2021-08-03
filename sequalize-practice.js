'use strict';

const {Sequelize, Op, Model, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite:./db/sqlorm.db', {
/*options*/
// logging: console.log        // options.logging: 

// logging: (...msg) => console.log(msg),
logging: false,
// logging: msg => logger.debug(msg),
// logging: logger.debug.bind(logger)

});

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        defaultValue: 'Doe'
    }, 
    birthdate: {
        type: DataTypes.DATEONLY,
        defaultValue: Sequelize.NOW
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    }
}, {
    timestamps: true, 
    createdAt: false
    // other options
});

async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.log('Unable to connect to database:', err);
    }
}

async function createTables() {
    // CREATING/defining tables.

    try {
        await User.sync({ alter: true });
        // User.sync({ force: true /* drops the table if it exists*/});
        // User.sync({ alter: true /* make it so that everything matches the new table*/});
        console.log('The table for the User model has been (re)created!');


        // await sequelize.sync({ force: true });
        // await sequelize.sync({ force: true, match: /_test$/ });      // match accepts a regex expression.

        console.log('All models were syncrhonized successfully.');
        // console.log(User === sequelize.models.User);
    } catch(err) {
        console.error('Error occurred during table creation.', err);
    }
}

async function insertUser() {

    try {
        // await User.drop(); // drops the User table.
        // await sequelize.dropt();    // drops all tables.
        

        // INSERTING/saving tuples to the table.
        const jane = await User.build({ firstName: 'Jane', age: 25});
        await jane.save();
        console.log('Jane was saved to the database!');


        // UPDATE tuples to the table. (Must call .save())
        jane.firstName = 'Ada';

        // reloading an instance:
        //await jane.reload(); // reload the jane instance with values in the database.

        let incrementResult = await jane.increment('age', { by:2, returning: false}); // increment jane's age.
        await jane.save();
        // console.log('increment result', incrementResult.toJSON());

        // Can specify which attributes to be saved/updated.
        await jane.save({ fields: ['firstName']});

        //console.log(jane.toJSON());

        // DELETE tuples/instance to the table/model.
        //await jane.destroy();
        // ------- OR -------
        const hugo = await User.create({ firstName: 'Hugo', lastName: 'Liao', age: 21});

        // fields:? specifies which fields to be created.
        const decoy = await User.create({ firstName: 'Decoy', lastName: 'Yoced', age: 55}, {fields: ['firstName', 'age']}); // lastName is default
        await decoy.reload().then(() => {console.log(decoy.toJSON()); });

        //console.log(hugo.toJSON());
    } catch(err) {
        console.log('Error occurred when logging data to the database.', err);
    }
}

async function runQuery() {
    
    try {
        // ====== SELECT queries =====


        // SELECT * FROM ...
        //console.log(await (await User.findAll()).every(user => user instanceof User)); // true
        //console.log('All users:', JSON.stringify(await User.findAll(), null, 2));

        // find by primary key
        const u = await User.findByPk(1);
        // console.log(u instanceof User, u.firstName ); // true when we find a user with primary key of 1
        

        // renaming attributes
        console.log('SELECTING and renaming \'lastName\' to \'familyName\'', JSON.stringify(await User.findAll({
            attributes: ['firstName', ['lastName', 'family name']]
            // can also do this:
            // attributes: { exclude: ['birthdate']}
        })));


        // aggregation:
        /*
        Model.findAll({
            attributes: [
                'foo',
                [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats'],
                'bar'
            ]
        });
        */


        // Find Or Create
        // const [a, created] = await User.findOrCreate({
        //     where: { firstName: 'Vinda'}, 
        //     defaults: {
        //         age: 30
        //     }
        // });

        // console.log(a.lastName, 'False when already created: ', created);


        // Find and Count All
        // const { cnt, rows } = await User.findAndCountAll({ 
        //     where: {
        //         age: {
        //             [Op.like]: '^([1-2]{2}'
        //         }
        //     }
        // });
        // console.log('count', cnt);
        // console.log('rows', rows);






    } catch(err) {
        console.error(err);
    }

    

}

(async () => {
    await authenticate();
    await createTables();
    // await insertUser();
    await runQuery();
    await sequelize.close();
    console.log('Database connection has been closed.');   
})() 


