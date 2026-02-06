const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');

// Configuration du client DynamoDB
const client = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
    }
});

const tables = [
    {
        TableName: "urls",
        AttributeDefinitions: [
            { AttributeName: 'shortKey', AttributeType: 'S' }
        ],
        KeySchema: [
            { AttributeName: 'shortKey', KeyType: 'HASH' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }
];

async function createTable(tableDefinition) {
    try {
        const command = new CreateTableCommand(tableDefinition);
        const response = await client.send(command);
        console.log(`Table '${tableDefinition.TableName}' créée avec succès`);
        return response;
    } catch (error) {
        if (error.name === 'ResourceInUseException' || (error.$metadata && error.$metadata.httpStatusCode === 400 && /Table already exists/i.test(error.message))) {
            console.log(`Table '${tableDefinition.TableName}' existe déjà`);
        } else {
            console.error(`Erreur lors de la création de '${tableDefinition.TableName}':`, error.message || error);
        }
    }
}

async function initializeTables() {
    console.log('Initialisation des tables DynamoDB...\n');

    for (const tableDefinition of tables) {
        await createTable(tableDefinition);
    }

    console.log('\nInitialisation terminée!');
}

// Exécution
initializeTables().catch(console.error);