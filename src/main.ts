import * as dotenv from 'dotenv';
dotenv.config();
import { appModule } from './module';
import 'reflect-metadata';

const bootstrap = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('database error');
  }
  const { httpServer, server } = await appModule.startApollo();

  httpServer.listen(4002, () =>
    console.log(
      'Server is running on http://localhost:4002' + server.graphqlPath,
    ),
  );
};
bootstrap();
