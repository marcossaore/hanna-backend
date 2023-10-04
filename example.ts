// // run-migrations.ts

// import { NestFactory } from '@nestjs/core';
// import { CommandModule, CommandService } from 'nestjs-command';
// import { AppModule } from './app.module';
// import { DynamicDatabaseService } from './dynamic-database.service';
// import { createConnectionOptions } from './dynamic-connection-options.factory';

// async function runMigrations() {
//   const app = await NestFactory.createApplicationContext(AppModule);

//   try {
//     // Get the DynamicDatabaseService and CommandService
//     const dynamicDatabaseService = app.get(DynamicDatabaseService);
//     const commandService = app.get(CommandService);

//     // Fetch the list of dynamic database names
//     const dynamicDatabaseNames = await dynamicDatabaseService.getAllDatabaseNames();

//     // Iterate through the dynamic databases and run migrations for each
//     for (const dbName of dynamicDatabaseNames) {
//       const connectionOptions = await createConnectionOptions(dbName, dynamicDatabaseService);
//       await commandService.exec({
//         module: CommandModule,
//         name: 'migration:run',
//         args: [`--connection=${dbName}`], // Pass the dynamic database name as a connection name
//         context: {
//           // Pass the dynamic connection options
//           database: connectionOptions,
//         },
//       });
//     }

//     console.log('Migrations completed successfully for all dynamic databases');
//   } catch (error) {
//     console.error('Error running migrations:', error);
//   } finally {
//     await app.close();
//   }
// }

// runMigrations();
